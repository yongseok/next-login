import { z } from 'zod';

export const DESCRIPTION_MAX_LENGTH = 5000;

export const gallerySchema = z.object({
  title: z.string().min(1, '제목은 필수입니다.'),
  description: z
    .string()
    .max(
      DESCRIPTION_MAX_LENGTH,
      `설명은 ${DESCRIPTION_MAX_LENGTH}자 이하로 입력해주세요.`
    )
    .optional(),
  fileList: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      filename: z.string(),
      mimetype: z.string(),
      size: z.number(),
    }),
    {
      message: '파일 목록이 필수입니다.',
    }
  ),
});

export type GalleryFormValues = z.infer<typeof gallerySchema>;