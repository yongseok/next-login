'use server';

import {
  LoginFormErrors,
  LoginFormState,
  loginSchema,
} from '@/lib/validations/loginSchema';
import {
  SignupFormErrors,
  SignupFormState,
  signupSchema,
} from '@/lib/validations/signupSchema';
import { userService } from '@/lib/services/user.service';
import { withActionErrorHandler } from '@/lib/errors/actionHandlers';

export const signup = withActionErrorHandler<SignupFormErrors>(
  async (_state: SignupFormState, formData: FormData) => {
    // 유효성 검사
    const validatedFields = signupSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    // 회원 등록
    await userService.signup(validatedFields);

    return { success: true, message: '회원가입 성공' };
  }
);

export const login = withActionErrorHandler<LoginFormErrors>(
  async (_state: LoginFormState, formData: FormData) => {
    // 유효성 검사
    const validatedFields = loginSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // 로그인
    await userService.login(validatedFields);

    return { success: true, message: '로그인 성공' };
  }
);
