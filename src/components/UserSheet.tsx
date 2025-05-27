import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
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
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import {
  userUpdateSchema,
  UserUpdateDto,
} from '@/lib/validations/userUpdateSchema';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Role } from '@prisma/client';

export function UserSheet() {
  const { data: session, status } = useSession();
  console.log('🚀 | UserSheet | session:', session);

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

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const onSubmit = async (data: UserUpdateDto) => {
    try {
      // TODO: 여기서 업데이트 요청을 보내야 함
      console.log('🚀 | onSubmit | data:', data);
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
              사용자 정보를 수정할 수 있습니다.
            </SheetDescription>
          </SheetHeader>
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
                        disabled
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
                        <SelectTrigger>
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
              <div className='flex justify-end'>
                <Button type='submit'>저장</Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
