import { Input } from './ui/input';
import { useSession } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from './ui/form';
import { useForm } from 'react-hook-form';
import {
  userUpdateSchema,
  UserUpdateDto,
} from '@/lib/validations/userUpdateSchema';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import Link from 'next/link';
import { Role } from '@prisma/client';
import { useTranslations } from 'next-intl';

interface UserFormProps {
  onSubmit: (data: UserUpdateDto) => void;
  children: React.ReactNode;
}

export function UserForm({ onSubmit, children }: UserFormProps) {
  const { data: session, status } = useSession();
  const t = useTranslations('UserForm');

  const form = useForm<UserUpdateDto>({
    resolver: zodResolver(userUpdateSchema(t)),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
      role: session?.user?.role ?? Role.USER,
    },
  });

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

  return (
    <div className='flex items-center gap-2'>
      <Form {...form}>
        <form
          onSubmit={() => {
            form.handleSubmit(onSubmit)();
          }}
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
                <FormMessage />
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
                <FormMessage />
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
                  You can manage email addresses in your{' '}
                  <Link href='/examples/forms'>email settings</Link>.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {children}
        </form>
      </Form>
    </div>
  );
}
