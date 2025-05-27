import { Role } from '@prisma/client';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: Role;
    } & DefaultSession['user'];
  }
  interface User {
    role?: Role;
    email: string | null;
  }
}
