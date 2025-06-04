import { z } from 'zod';

export const signupSchema = (t: (key: string) => string) => z
    .object({
    email: z.string().email({ message: t('email') }),
      name: z
        .string()
      .min(2, { message: t('nameMinLength') })
        .optional(),
      password: z
        .string()
      .min(8, { message: t('passwordMinLength') })
        .regex(/[^a-zA-Z0-9]/, {
          message: t('passwordSpecialCharacter'),
        })
        .trim(),
      confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('passwordMatch'),
    });

export type SignupFormErrors = {
  email?: string[];
  name?: string[];
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

export type SignupForm = z.infer<ReturnType<typeof signupSchema>>;
