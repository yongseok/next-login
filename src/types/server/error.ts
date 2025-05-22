/**
 * 기본 API 오류 응답 인터페이스
 */
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

/**
 * HTTP 상태 코드 타입
 * ```
 * 400: Bad Request (잘못된 요청)
 * 401: Unauthorized (인증 실패)
 * 403: Forbidden (권한 없음)
 * 404: Not Found (리소스 없음)
 * 409: Conflict (충돌)
 * 422: Unprocessable Entity (처리 불가능한 엔티티)
 * 500: Internal Server Error (서버 오류)
 * ```
 */
export type HttpStatusCode = 400 | 401 | 403 | 404 | 409 | 422 | 500;

/**
 * 액션 오류 응답 인터페이스
 */
export interface ActionResponse<Errors = unknown> {
  success: boolean;
  message: string;
  errors?: Errors; // 폼 유효성 에러만
  details?: unknown; // 서비스/비즈니스 에러 등 기타 정보
}
