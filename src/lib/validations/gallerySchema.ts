import { z } from 'zod';
import { TRANSFER_STATUS_ENUM } from '@/types/gallery';

export const DESCRIPTION_MAX_LENGTH = 5000;

const fileInfoSchema = z.object({
  filename: z.string(),
  mimetype: z.string(),
  size: z.number(),
});

const transferFileSchema = z.object({
  id: z.string(),
  info: fileInfoSchema,
});

const localFileSchema = z.object({
  id: z.string(),
  type: z.literal('local'),
  info: fileInfoSchema,
  file: z.instanceof(File),
  previewUrl: z.string().optional(),
  transfer: z.object({
    status: z.enum(TRANSFER_STATUS_ENUM),
    progress: z.number(),
    errorMessage: z.string().optional(),
  }),
});

const serverFileSchema = z.object({
  id: z.string(),
  type: z.literal('server'),
  info: fileInfoSchema,
  url: z.string(),
});

export const fileDataSchema = z.union([localFileSchema, serverFileSchema]);

export const gallerySchema = z.object({
  title: z.string().min(1, '제목은 필수입니다.'),
  description: z
    .string()
    .max(
      DESCRIPTION_MAX_LENGTH,
      `설명은 ${DESCRIPTION_MAX_LENGTH}자 이하로 입력해주세요.`
    )
    .optional(),
  fileList: z.array(transferFileSchema),
});

export type GalleryFormValues = z.infer<typeof gallerySchema>;