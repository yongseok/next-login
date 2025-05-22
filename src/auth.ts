import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
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
});
