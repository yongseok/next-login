import { z } from 'zod';

export const gallerySchema = z.object({
  title: z.string().min(1, '제목은 필수입니다.'),
  description: z.string().optional(),
  fileList: z.array(z.string(), {
    message: '파일 목록이 필수입니다.',
  }),
});
