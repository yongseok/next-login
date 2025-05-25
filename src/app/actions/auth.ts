'use server';

import {
  LoginFormErrors,
  LoginFormState,
} from '@/lib/validations/loginSchema';
import {
  SignupFormErrors,
  SignupFormState,
  signupSchema,
} from '@/lib/validations/signupSchema';
import { userService } from '@/lib/services/user.service';
import { withActionErrorHandler } from '@/lib/errors/actionHandlers';
import { signIn } from '@/auth';

export const signupAction = withActionErrorHandler<SignupFormErrors>(
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

export const signinAction = withActionErrorHandler<LoginFormErrors>(
  async (_state: LoginFormState, formData: FormData) => {
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    if (!result?.ok) {
      throw new Error('로그인에 실패했습니다.');
    }

    return { success: true, message: '로그인 성공' };
  }
);
