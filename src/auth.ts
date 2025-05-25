import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import NextAuth from 'next-auth';
import { userService } from './lib/services/user.service';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from './lib/validations/loginSchema';
import { ZodError } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
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
          const { email, password } = await loginSchema.parseAsync(credentials);
          const user = await userService.login({ email, password });
          if (!user) {
            throw new Error('Invalid credentials.');
          }
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            throw error;
          } else {
            throw new Error('Invalid credentials.');
          }
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
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      // console.log('🚀 | session | session:', session);
      // console.log('🚀 | session | token:', token);
      session.user.id = token.sub as string;
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
});
