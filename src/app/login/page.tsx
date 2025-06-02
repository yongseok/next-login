import LoginForm from '@/app/login/components/LoginForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { error, code } = await searchParams;

  if (error) {
    return (
      <div>
        Error: {error}, code: {code}
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='flex flex-col items-center gap-2'>
          <div className='bg-primary rounded-full p-3'>
            <LogIn className='w-8 h-8 text-primary-foreground' />
          </div>
          <CardTitle className='text-2xl font-bold'>로그인</CardTitle>
          <p className='text-gray-500 text-sm'>계정에 로그인하세요</p>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
