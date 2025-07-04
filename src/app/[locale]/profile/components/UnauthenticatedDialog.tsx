'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { redirect } from 'next/navigation';

export default function UnauthenticatedDialog() {
  return (
    <div className='flex items-center justify-center h-[60vh] text-xl text-gray-500'>
      Unauthenticated
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unauthenticated</AlertDialogTitle>
            <AlertDialogDescription>
              You are not authenticated. Please sign in to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => redirect('/login')}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
