import { auth } from '@/auth';
import Profile from '@/app/[locale]/profile/components/Profile';
import { UserProfileDto } from '@/types/user';
import { Role } from '@prisma/client';
import UnauthenticatedDialog from './components/UnauthenticatedDialog';

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    return <UnauthenticatedDialog />;
  }

  if (!session.user.email) {
    return (
      <div className='flex items-center justify-center h-[60vh] text-xl text-gray-500'>
        이메일이 없습니다.
      </div>
    );
  }

  const user: UserProfileDto = {
    id: session.user.id,
    name: session.user.name ?? '',
    email: session.user.email,
    role: session.user.role ?? Role.USER,
    image: session.user.image ?? '',
  };

  return (
    <div className='w-full max-w-7xl mx-auto'>
      <Profile user={user} />
    </div>
  );
}
