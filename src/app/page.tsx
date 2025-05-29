'use client';

import { UserAuthForm } from '@/components/UserAuthForm';
import { useSession } from 'next-auth/react';
import Profile from './profile/components/Profile';
import { useGetUserByEmail } from '@/lib/swr/useUsers';

export default function Home() {
  const { data: session } = useSession();

  const { user, isLoading } = useGetUserByEmail(session?.user?.email ?? '');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Profile user={user} />;
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-4'>Hello Felix home</h1>
      <UserAuthForm />
    </div>
  );
}
