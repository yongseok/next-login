import SignupForm from './components/SignupForm';

export default async function SignupPage({
  params,
}: {
  params: { locale: string };
}) {
  // const { locale } = await params;
  return <SignupForm />;
}
