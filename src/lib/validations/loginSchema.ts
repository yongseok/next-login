import { z } from 'zod';

export const loginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email({ message: t('email') }),
  password: z
    .string()
    .min(8, { message: t('passwordMinLength') })
    .regex(/[^a-zA-Z0-9]/, {
      message: t('passwordSpecialCharacter'),
    })
    .trim(),
});

export interface AuthFormErrors {
  email?: string[];
  password?: string[];
  OAuthError?: string;
  CredentialsError?: string;
  [key: string]: string | string[] | undefined;
}

export type LoginFormState =
  | {
      success?: boolean;
      errors?: AuthFormErrors;
      message?: string;
    }
  | undefined;

export type LoginForm = z.infer<ReturnType<typeof loginSchema>>;
