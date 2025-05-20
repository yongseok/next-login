'use server';

import { LoginFormState, loginSchema } from '@/lib/validations/loginSchema';
import { SignupFormState, signupSchema } from '@/lib/validations/signupSchema';

export async function signup(state: SignupFormState, formData: FormData) {
  const validatedFields = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields',
    };
  }

  const { email, password, confirmPassword } = validatedFields.data;
  // TODO: 회원가입 로직 구현

  return { message: 'User created successfully' };
}

export async function login(state: LoginFormState, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields',
    };
  }

  const { email, password } = validatedFields.data;
  // TODO: 로그인 로직 구현

  return { message: 'User logged in successfully' };
}
