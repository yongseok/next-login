export const runtime = 'nodejs';
import LoginForm from '@/app/[locale]/login/components/LoginForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations('login');
  const { error, code } = await searchParams;

  if (error) {
    /**
     * 예시: 계정 연결 로직(권장)
     * 사용자가 OAuth로 로그인 시도 → OAuthAccountNotLinked 에러 발생
     * 로그인 페이지에서 해당 에러를 감지하여, "이메일로 로그인 후 계정 연결" 안내
     * 사용자가 기존 계정(이메일/비밀번호)으로 로그인 → 마이페이지 등에서 "구글 계정 연결" 버튼 제공
     * 버튼 클릭 시, OAuth provider 연결(링킹) API 호출
     */
    if (error === 'OAuthAccountNotLinked') {
      return (
        <div>
          <h1>이메일로 로그인 후 계정 연결</h1>
          <Button>Sign Out</Button>
        </div>
      );
    }
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
          <CardTitle className='text-2xl font-bold'>{t('title')}</CardTitle>
          <p className='text-gray-500 text-sm'>{t('description')}</p>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
