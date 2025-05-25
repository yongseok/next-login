'use client';

import LoginButton from '@/components/LoginButton';
import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  // console.log('🚀 | Home | session:', session);
  /* session: 
  {
    "user": {
        "name": "yong seok kim",
        "email": "codeozxxx@gmail.com",
        "image": "https://lh3.googleusercontent.com/a/ACg8ocJxMn6QrjLKANZ81XKIazf4k19yPM3Fkl6DWWCevwOJW_jgOTlG=s96-c",
        "id": "a43fd456-89a0-45a4-8802-d63a61ca9f05"
    },
    "expires": "2025-06-21T15:29:53.585Z"
  } | null | undefined
   */
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-4'>Hello Felix home</h1>
      <div className='flex flex-col gap-2 mb-4'>
        <LoginButton provider='credentials' redirect={true} redirectTo='/' />
        <LoginButton provider='google' redirect={true} redirectTo='/' />
        <LoginButton provider='github' redirect={true} redirectTo='/' />
      </div>
      {session ? (
        <div>
          <p>Signed in as {session.user?.email}</p>
          <Button onClick={() => signOut()}>Sign out OAuth</Button>
        </div>
      ) : (
        <div>
          <p>Not signed in</p>
          <Button onClick={() => signIn()}>Sign in OAuth</Button>
        </div>
      )}
    </div>
  );
}
