import LoginForm from '@/app/login/components/LoginForm';

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

  return <LoginForm />;
}
