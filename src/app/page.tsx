'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-4'>Hello Felix home</h1>
      <div className='grid gap-2'>
        <div className='grid gap-1'>
          <Label className='sr-only' htmlFor='email'>
            Email
          </Label>
          <Input
            id='email'
            placeholder='name@example.com'
            type='email'
            autoCapitalize='none'
            autoComplete='email'
            autoCorrect='off'
            disabled={isLoading}
          />
        </div>
        <Button disabled={isLoading} onClick={() => setIsLoading(true)}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Sign In with Email
        </Button>
      </div>
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
