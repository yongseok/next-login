import { Role } from '@prisma/client';
import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.string().email({ message: '이메일 형식이 올바르지 않습니다.' }),
    name: z
      .string()
      .min(2, { message: '이름은 2자 이상이어야 합니다.' })
      .optional(),
    role: z.enum([Role.USER, Role.ADMIN]),
    password: z
      .string()
      .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: '특수문자를 포함해야 합니다.',
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export type SignupFormErrors = {
  email?: string[];
  name?: string[];
  role?: string[];
  password?: string[];
  confirmPassword?: string[];
};

export type SignupFormState =
  | {
      success?: boolean;
      errors?: SignupFormErrors;
      message?: string;
    }
  | undefined;

export type SignupForm = z.infer<typeof signupSchema>;
