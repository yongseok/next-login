'use client';

import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-4'>Hello Felix home</h1>
      {session ? (
        <div>
          <p>Signed in as {session.user?.email}</p>
          <Button onClick={() => signOut()}>Sign out OAuth</Button>
        </div>
      ) : (
        <div>
          <p>Not signed in</p>
          <Button onClick={() => signIn()}>Login</Button>
        </div>
      )}
    </div>
  );
}
