import { ZodError } from 'zod';
import { AppError } from './errors';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ActionResponse } from '@/types/server/error';

/**
 * 액션 오류 응답 생성 함수
 */
export function createActionErrorResponse<Errors = unknown>(
  error: Error | AppError | ZodError,
  isProd: boolean = process.env.NODE_ENV === 'production'
): ActionResponse<Errors> {
  // 폼 액션은 프론트에서 바로 error로 사용하므로 ValidationError로 한 번 더 감싸는 과정이 불필요(최종적으로 사용할 곳에서 바로 쓸 수 있는 형태로 데이터를 넘기다.)
  if (error instanceof ZodError) {
    return {
      success: false,
      message: error.issues?.[0]?.message ?? '알 수 없는 유효성 검사 오류',
      errors: error.flatten().fieldErrors as Errors,
    };
  }

  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      details: isProd ? undefined : error.details,
    };
  }

  if (error instanceof PrismaClientKnownRequestError) {
    return {
      success: false,
      message: error.message,
      details: isProd
        ? undefined
        : { meta: error.meta, clientVersion: error.clientVersion },
    };
  }

  console.error('🚨 Unexpected error:', error);

  return { success: false, message: '알 수 없는 오류' };
}

/**
 * 액션 오류 핸들러 미들웨어
 */
export function withActionErrorHandler<Errors = unknown>(
  handler: (state: ActionResponse<Errors>, formData: FormData) => Promise<ActionResponse<Errors>>
) {
  return async (state: ActionResponse<Errors>, formData: FormData): Promise<ActionResponse<Errors>> => {
    try {
      return await handler(state, formData);
    } catch (error) {
      return createActionErrorResponse<Errors>(error as Error);
    }
  };
}
