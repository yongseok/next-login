import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import NextAuth from 'next-auth';
import { userService } from './lib/services/user.service';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from './lib/validations/loginSchema';
import { Role } from '@prisma/client';
import { AppError } from './lib/errors/errors';
import { getTranslations } from 'next-intl/server';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/database/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    Credentials({
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const t = await getTranslations('zod');
          const { email, password } = await loginSchema(t).parseAsync(
            credentials
          );
          const user = await userService.login({ email, password });
          return user;
        } catch (error) {
          if (error instanceof AppError) {
            console.error(
              '🚀 | authorize | error:',
              error.message,
              error.details ? JSON.stringify(error.details) : 'no details'
            );
          } else {
            console.error('🚀 | authorize | error:', error);
          }
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: 'http://localhost:3000/api/auth/callback/google',
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: 'http://localhost:3000/api/auth/callback/github',
        },
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // 로그인 시 사용자 정보 생성
    // 호출 시점: 로그인 시 호출
    async signIn({ user }) {
      console.log('🚀 | signIn | user:', user);
      try {
        if (user.email) {
          const findUser = await userService.getUserByEmail(user.email);
          if (!findUser) {
            // await userService.signup({
            //   email: user.email,
            //   name: user.name,
            //   password: '',
            //   role: Role.USER,
            // });
          } else {
            // OAuth 로그인 시 사용자 정보를 내 서버 정보로 업데이트 해야 함
            user.name = findUser?.name ?? user.name;
            user.image = findUser?.image ?? user.image;
            user.role = findUser?.role ?? Role.USER;
          }
        }
        return true;
      } catch (error) {
        console.error('🚀 | signIn | error:', error);
        return false;
      }
    },
    // 사용자 정보 생성 후 토큰 생성
    // 호출 시점: 사용자 정보 생성 후 호출
    async jwt({ token, user, trigger, session }) {
      // sessionUpdate 호출 시
      if (trigger === 'update' && session) {
        return { ...token, ...session.user };
      }

      // 🔑 user 정보를 토큰에 저장(토큰 생성 시에만 user 정보가 있음)
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // 세션 생성 시 사용자 정보 추가
    // 호출 시점: 세션 생성 시 호출(useSession(), auth() 호출 시)
    async session({ session, token }) {
      try {
        if (token?.id && session.user) {
          session.user.id = token.id as string;
        }
        if (token?.role && session.user) {
          session.user.role = token.role as Role;
        }
      } catch (error) {
        console.error('🚀 | session | error:', error);
      } finally {
        return session;
      }
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
});
