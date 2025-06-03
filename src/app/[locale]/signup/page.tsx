import SignupForm from './components/SignupForm';

export default function SignupPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  console.log('🚀 | locale:', locale);
  return <SignupForm />;
}
