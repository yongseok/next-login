import { ValidationError } from './errors';
import { ZodError } from 'zod';
import { AppError } from './errors';
import { ApiErrorResponse } from '@/types/server/error';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

/**
 * API 오류 응답 생성 함수
 */
export function createApiErrorResponse(
  error: Error | AppError | ZodError,
  isProd: boolean = process.env.NODE_ENV === 'production'
): NextResponse<ApiErrorResponse> {
  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.message,
      error.flatten().fieldErrors
    );
    return createApiErrorResponse(validationError, isProd);
  }

  if (error instanceof AppError) {
    const response: ApiErrorResponse = {
      error: error.message,
      code: error.code,
      details: isProd ? undefined : error.details,
    };

    return NextResponse.json(response, { status: error.statusCode });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    const response: ApiErrorResponse = {
      error: error.message,
      code: error.code,
      details: isProd
        ? undefined
        : { meta: error.meta, clientVersion: error.clientVersion },
    };

    return NextResponse.json(response, { status: 500 });
  }

  console.error('🚨 Unexpected error:', error);

  const response: ApiErrorResponse = {
    error: isProd ? 'Internal Server Error' : error.message,
    code: 'INTERNAL_SERVER_ERROR',
  };

  return NextResponse.json(response, { status: 500 });
}

/**
 * 오류 핸들러 미들웨어
 * @param handler - 요청 처리 함수
 * @returns 오류 핸들러 미들웨어
 * @example
 * ```ts
 * // 정적 라우트에서(`app/user`) 사용 예시
 * export const POST = withErrorHandler(async (request: NextRequest) => {
 *   const body = await request.json();
 *   const { name, email, password } = body;
 *   const user = await db.createUser({ name, email, password });
 * });
 * // 동적 라우트에서(`app/user/[id]`) params 사용 예시
 * export const GET = withErrorHandler(
 *   async (
 *     _request: NextRequest,
 *     { params }: { params: Promise<{ id: string }> }
 *   ) => {
 *     const { id } = await params;
 *   }
 * );
 * ```
 */
export function withApiErrorHandler<P extends { [key: string]: string }>(
  handler: (
    req: NextRequest,
    context: { params: Promise<P> }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: { params: Promise<P> }) => {
    try {
      return await handler(req, context);
    } catch (error) {
      return createApiErrorResponse(error as Error);
    }
  };
}
