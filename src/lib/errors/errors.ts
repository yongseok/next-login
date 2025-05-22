import { HttpStatusCode } from '@/types/server/error';

/**
 * 기본 API 오류 클래스
 */
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly code?: string,
    public readonly details?: unknown,
    public readonly statusCode: HttpStatusCode = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 유효성 검사 오류
 */
export class ValidationError extends AppError {
  constructor(message: string, public readonly details?: unknown) {
    super(message, 'VALIDATION_ERROR', details, 400);
  }
}

/**
 * 인증 오류
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string = '인증 실패',
    public readonly details?: unknown
  ) {
    super(message, 'AUTHENTICATION_ERROR', details, 401);
  }
}

/**
 * 권한 오류
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string = '권한 없음',
    public readonly details?: unknown
  ) {
    super(message, 'AUTHORIZATION_ERROR', details, 403);
  }
}

/**
 * 리소스 존재 하지 않음
 */
export class NotFoundError extends AppError {
  constructor(message: string, public readonly details?: unknown) {
    super(message, 'NOT_FOUND_ERROR', undefined, 404);
  }
}

/**
 * 중복 데이터 오류
 */
export class DuplicateDataError extends AppError {
  constructor(resource: string, public readonly details?: unknown) {
    super(
      `${resource} 리소스가 이미 존재합니다.`,
      'DUPLICATE_DATA_ERROR',
      details,
      409
    );
  }
}

/**
 * 서버 내부 오류
 */
export class InternalServerError extends AppError {
  constructor(
    message: string = '서버 오류가 발생했습니다.',
    public readonly details?: unknown
  ) {
    super(message, 'INTERNAL_SERVER_ERROR', details, 500);
  }
}
