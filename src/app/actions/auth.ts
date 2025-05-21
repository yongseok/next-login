'use server';

import { LoginFormState, loginSchema } from '@/lib/validations/loginSchema';
import { SignupFormState, signupSchema } from '@/lib/validations/signupSchema';
import { userService } from '@/lib/services/user.service';

export async function signup(state: SignupFormState, formData: FormData) {
  const validatedFields = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  // 유효성 검사 실패
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields',
    };
  }

  // 회원 등록
  const { email, password } = validatedFields.data;
  try {
    await userService.signup({ email, password });
  } catch (error) {
    console.error('Error creating user', error);
    return { success: false, message: '회원가입 실패' };
  }

  return { success: true, message: '회원가입 성공' };
}

export async function login(state: LoginFormState, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // 유효성 검사 실패
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields',
    };
  }

  // 로그인
  const { email, password } = validatedFields.data;
  try {
    const loginResult = await userService.login({ email, password });
    if (!loginResult.success) {
      return { success: false, message: loginResult.message };
    }
  } catch (error) {
    console.error('Error in login action', error);
    return {
      success: false,
      message: '로그인 중 알 수 없는 오류가 발생했습니다.',
    };
  }

  return { success: true, message: '로그인 성공' };
}
