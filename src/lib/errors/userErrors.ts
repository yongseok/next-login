// User 도메인 특화 에러

import { AppError } from './errors';

export class UserNotFoundError extends AppError {
  constructor(message: string = '사용자를 찾을 수 없습니다.') {
    super(message, 'USER_NOT_FOUND', undefined, 404);
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor(message: string = '이미 존재하는 사용자입니다.') {
    super(message, 'USER_ALREADY_EXISTS', undefined, 400);
  }
}

export class UserInvalidCredentialsError extends AppError {
  constructor(message: string = '잘못된 자격 증명입니다.') {
    super(message, 'USER_INVALID_CREDENTIALS', undefined, 401);
  }
}

export class UserOAuthError extends AppError {
  constructor(message: string = 'OAuth 로그인 실패') {
    super(message, 'USER_OAUTH_ERROR', undefined, 401);
  }
}

export class UserPasswordMismatchError extends AppError {
  constructor(message: string = '비밀번호가 일치하지 않습니다.') {
    super(message, 'USER_PASSWORD_MISMATCH', undefined, 401);
  }
}
