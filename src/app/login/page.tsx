import LoginForm from '@/app/login/components/LoginForm';
import { useLogin } from '@/lib/hooks/useLogin';
import { useSession } from 'next-auth/react';

export default function SignInPage() {
  const { data: session } = useSession();
  const {
    isLoading,
    loginWithOAuth,
    loginWithCredentials,
    error,
  } = useLogin();
  return (
    <LoginForm
      isLoading={isLoading}
      loginWithOAuth={loginWithOAuth}
      loginWithCredentials={loginWithCredentials}
      error={error}
      session={session}
    />
  );
}
