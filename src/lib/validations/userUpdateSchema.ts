import { Role } from '@prisma/client';
import { z } from 'zod';

export const userUpdateSchema = z.object({
  email: z.string().email({ message: '이메일 형식이 올바르지 않습니다.' }),
  name: z
    .string()
    .min(2, { message: '이름은 2자 이상이어야 합니다.' })
    .optional(),
  role: z.nativeEnum(Role).optional(),
  password: z
    .string()
    .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: '특수문자를 포함해야 합니다.',
    })
    .trim()
    .optional(),
});

export type UserUpdateDto = z.infer<typeof userUpdateSchema>;
