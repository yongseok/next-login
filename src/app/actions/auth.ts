'use server';

import {
  SignupFormErrors,
  SignupFormState,
  signupSchema,
} from '@/lib/validations/signupSchema';
import { userService } from '@/lib/services/user.service';
import { withActionErrorHandler } from '@/lib/errors/actionHandlers';
import { Role } from '@prisma/client';

export const signupAction = withActionErrorHandler<SignupFormErrors>(
  async (_state: SignupFormState, formData: FormData) => {
    // 유효성 검사
    try {
      const validatedFields = signupSchema.parse({
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        role: formData.get('role') ?? Role.USER,
      });
      // 회원 등록
      await userService.signup(validatedFields);

      return { success: true, message: '회원가입 성공' };
    } catch (error) {
      console.log('🚀 | signupAction | error:', error);
      throw error;
    }
  }
);
