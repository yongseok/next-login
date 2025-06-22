import useSWRMutation from 'swr/mutation';
import { API_ENDPOINTS } from '../config/api';
import { FileWithPreview } from '@/types/gallery';
import { uploadFileWithPreview } from './fetcher';
import { useCallback, useRef } from 'react';
import axios from 'axios';

class UploadError extends Error {
  fileWithPreview: FileWithPreview;
  cause?: unknown;

  constructor(message: string, file: FileWithPreview, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UploadError';
    this.fileWithPreview = file;
    this.cause = options?.cause;
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
  const abortControllerRef = useRef<Map<string, AbortController>>(new Map());
  const abort = useCallback((id: string) => {
    const abortController = abortControllerRef.current.get(id);
    if (abortController) {
      abortController.abort();
      abortControllerRef.current.delete(id);
    }
  }, []);

  const { trigger, isMutating } = useSWRMutation(
    API_ENDPOINTS.GALLERY.UPLOAD,
    (url, { arg: fileWithPreview }: { arg: FileWithPreview }) => {
      const abortController = new AbortController();
      abortControllerRef.current.set(fileWithPreview.id, abortController);

      const promise = uploadFileWithPreview(
        url,
        fileWithPreview,
        abortController.signal,
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
          console.log('🚀 | error:', error);
          const message =
            error instanceof Error ? error.message : 'Upload failed';
          throw new UploadError(message, fileWithPreview, { cause: error }); // 🔑 onError 에서 사용됨
        })
        .finally(() => {
          abortControllerRef.current.delete(fileWithPreview.id);
        });
    },
    {
      throwOnError: false,
      onSuccess: ({ fileWithPreview }) => {
        updateFile(fileWithPreview.id, {
          progress: 100,
          status: 'success' as const,
        });
      },
      onError: (err) => {
        if (err instanceof UploadError) {
          const { fileWithPreview, cause } = err;
          console.log('🚀 | cause:', cause);
          if (axios.isCancel(cause)) {
            updateFile(fileWithPreview.id, { status: 'canceled' });
            return;
          }
          updateFile(fileWithPreview.id, { status: 'error' });
        }
      },
    }
  );

  return { trigger, isMutating, abort };
};
