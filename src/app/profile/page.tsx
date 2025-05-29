import { auth } from '@/auth';
import { userService } from '@/lib/services/user.service';
import { UserCircleIcon } from 'lucide-react';
import LogoutButton from './components/LogoutButton';

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

  if (!user) {
    return (
      <div className='flex items-center justify-center h-[60vh] text-xl text-gray-500'>
        유저 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-[70vh] py-10'>
      <div className='p-10 w-full max-w-md flex flex-col items-center'>
        <UserCircleIcon className='w-24 h-24 text-primary mb-4' />
        <h1 className='text-3xl font-bold mb-2 text-primary'>{user.name}</h1>
        <p className='text-primary mb-1'>{user.email}</p>
        <span className='inline-block mt-2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold'>
          {user.role}
        </span>
        <div className='w-full flex justify-center mt-4'>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
