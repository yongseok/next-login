'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function LogoutButton() {
  const t = useTranslations('login');
  return (
    <Button onClick={() => signOut()}>
      <LogOut className='w-5 h-5' />
      {t('logout')}
    </Button>
  );
}
