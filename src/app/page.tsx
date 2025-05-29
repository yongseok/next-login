'use client';

import { UserAuthForm } from '@/components/UserAuthForm';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-4'>Hello Felix home</h1>
      <UserAuthForm />
    </div>
  );
}
