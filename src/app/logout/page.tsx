'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function LogoutPage() {
  const handleLogout = async () => {
    await signOut({
      redirect: true,
      redirectTo: '/',
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='flex flex-col items-center gap-2'>
          <div className='bg-primary rounded-full p-3'>
            <LogOut className='w-8 h-8 text-primary-foreground' />
          </div>
          <CardTitle className='text-2xl font-bold'>로그아웃</CardTitle>
          <p className='text-gray-500 text-sm'>정말 로그아웃 하시겠습니까?</p>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-4'>
          <p className='text-muted-foreground text-center text-sm mb-2'>
            로그아웃하면 메인 페이지로 이동합니다.
          </p>
          <Button
            onClick={handleLogout}
            className='w-40 bg-primary text-primary-foreground font-semibold'
          >
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
