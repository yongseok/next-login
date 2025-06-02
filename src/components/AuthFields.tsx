'use client';

import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { LoginFormErrors } from '@/lib/validations/loginSchema';

interface AuthFieldsProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  errors?: LoginFormErrors | null;
}

export default function AuthFields<T extends FieldValues>({
  form,
  errors,
}: AuthFieldsProps<T>) {
  return (
    <>
      <FormField
        control={form.control}
        name={'email' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder='이메일을 입력하세요'
                className='bg-gray-50'
              />
            </FormControl>
            <FormMessage>
              {errors?.email && (
                <p className='text-sm font-medium text-destructive'>
                  {errors.email}
                </p>
              )}
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'password' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                {...field}
                type='password'
                placeholder='비밀번호를 입력하세요'
                className='bg-gray-50'
              />
            </FormControl>
            <FormMessage>
              {errors?.password && (
                <p className='text-sm font-medium text-destructive'>
                  {errors.password}
                </p>
              )}
            </FormMessage>
          </FormItem>
        )}
      />
    </>
  );
}
