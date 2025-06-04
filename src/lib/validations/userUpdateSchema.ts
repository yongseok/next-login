import { Role } from '@prisma/client';
import { z } from 'zod';

export const userUpdateSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email({ message: t('email') }),
    name: z
      .string()
      .min(2, { message: t('nameMinLength') })
      .optional(),
    role: z.nativeEnum(Role).optional(),
    password: z
      .string()
      .min(8, { message: t('passwordMinLength') })
      .regex(/[^a-zA-Z0-9]/, {
        message: t('passwordSpecialCharacter'),
      })
      .trim()
      .optional(),
  });

export type UserUpdateDto = z.infer<ReturnType<typeof userUpdateSchema>>;
