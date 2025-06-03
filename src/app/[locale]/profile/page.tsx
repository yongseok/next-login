import { auth } from '@/auth';
import { userService } from '@/lib/services/user.service';
import Profile from '@/app/[locale]/profile/components/Profile';

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    return (
      <div className='flex items-center justify-center h-[60vh] text-xl text-gray-500'>
        Unauthenticated
      </div>
    );
  }

  if (!session.user.email) {
    return (
      <div className='flex items-center justify-center h-[60vh] text-xl text-gray-500'>
        이메일이 없습니다.
      </div>
    );
  }

  const user = await userService.getUserByEmail(session.user.email);

  return <Profile user={user} />;
}
