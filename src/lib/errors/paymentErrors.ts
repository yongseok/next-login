// Payment 도메인 에러(아직 사용 안함)

import { AppError } from './errors';

export class PaymentNotFoundError extends AppError {
  constructor(message: string = '결제 정보를 찾을 수 없습니다.') {
    super(message, 'PAYMENT_NOT_FOUND', undefined, 404);
  }
}
