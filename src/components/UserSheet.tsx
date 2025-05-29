import { Loader2, Menu } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from './ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import {
  userUpdateSchema,
  UserUpdateDto,
} from '@/lib/validations/userUpdateSchema';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Role } from '@prisma/client';
import { useUpdateUser } from '@/lib/swr/useUsers';
import Link from 'next/link';

export function UserSheet() {
  const { data: session } = useSession();
  const { userUpdateTrigger, userUpdateIsMutating, userUpdateError } =
    useUpdateUser(session?.user?.email ?? '');

  const form = useForm<UserUpdateDto>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
      role: session?.user?.role ?? Role.USER,
    },
  });
  const {
    formState: { errors },
  } = form;

  useEffect(() => {
    if (session) {
      form.reset({
        name: session.user?.name ?? '',
        email: session.user?.email ?? '',
        role: session.user?.role ?? Role.USER,
      });
    }
  }, [session, form]);

  // if (session === null) {
  //   return <div>Loading...</div>;
  // }

  const onSubmit = async (data: UserUpdateDto) => {
    try {
      userUpdateTrigger(data);
    } catch (error) {
      console.error('🚀 | onSubmit | error:', error);
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>사용자 정보</SheetTitle>
            <SheetDescription>
              {session ? '사용자 정보를 수정할 수 있습니다.' : '로그인 후 사용할 수 있습니다.'}
            </SheetDescription>
          </SheetHeader>
          {session ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 p-4'
              >
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className='disabled:opacity-100'
                          value={field.value}
                          disabled={true}
                        />
                      </FormControl>
                      <FormMessage>{errors.email?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage>{errors.name?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a role' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                          <SelectItem value={Role.USER}>User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        사용자 권한을 수정할 수 있습니다.
                      </FormDescription>
                      <FormMessage>{errors.role?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <SheetClose asChild>
                  <Button
                    type='submit'
                    disabled={userUpdateIsMutating}
                    className='w-full'
                  >
                    {userUpdateIsMutating ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      '저장'
                    )}
                  </Button>
                </SheetClose>
                {userUpdateError && (
                  <p className='text-red-500'>{userUpdateError.message}</p>
                )}
              </form>
            </Form>
          ) : (
            <div className='flex flex-col items-center justify-center h-full gap-4'>
              <p>로그인 후 사용할 수 있습니다.</p>
              <SheetClose asChild>
                <Button asChild>
                  <Link href='/api/auth/signin'>로그인</Link>
                </Button>
              </SheetClose>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
