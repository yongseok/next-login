import useSWRMutation from 'swr/mutation';
import { API_ENDPOINTS } from '../config/api';
import { FileWithPreview } from '@/types/gallery';
import { uploadFileWithPreview } from './fetcher';

class UploadError extends Error {
  fileWithPreview: FileWithPreview;

  constructor(message: string, file: FileWithPreview) {
    super(message);
    this.name = 'UploadError';
    this.fileWithPreview = file;
  }
}

/**
 * 파일 업로드 처리
 * @param updateFile 파일 상태 업데이트 함수
 * @returns 파일 업로드 트리거 함수와 업로드 중 여부
 */
export const useFileUpload = (
  updateFile: (id: string, file: Partial<FileWithPreview>) => void
) => {
  const { trigger, isMutating } = useSWRMutation(
    API_ENDPOINTS.GALLERY.UPLOAD,
    (url, { arg: fileWithPreview }: { arg: FileWithPreview }) => {
      const promise = uploadFileWithPreview(
        url,
        fileWithPreview,
        (progress: number) => {
          updateFile(fileWithPreview.id, {
            progress,
            status: 'uploading' as const,
          });
        }
      );

      return promise
        .then((result) => ({ result, fileWithPreview })) // 🔑 onSuccess 에서 사용됨
        .catch((error) => {
          const message =
            error instanceof Error ? error.message : 'Upload failed';
          throw new UploadError(message, fileWithPreview); // 🔑 onError 에서 사용됨
        });
    },
    {
      onSuccess: ({ fileWithPreview }) => {
        updateFile(fileWithPreview.id, {
          progress: 100,
          status: 'success' as const,
        });
      },
      onError: (err) => {
        if (err instanceof UploadError) {
          const { fileWithPreview } = err;
          updateFile(fileWithPreview.id, { status: 'error' });
        }
      },
    }
  );

  return { trigger, isMutating };
};
