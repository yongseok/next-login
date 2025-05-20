import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: '이메일 형식이 올바르지 않습니다.' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: '특수문자를 포함해야 합니다.',
    })
    .trim(),
});

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type LoginForm = z.infer<typeof loginSchema>;