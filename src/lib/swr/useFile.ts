import useSWRMutation from 'swr/mutation';
import { API_ENDPOINTS } from '../config/api';
import { FileWithPreview } from '@/types/gallery';
import { uploadFileWithPreview } from './fetcher';
import { useCallback, useRef } from 'react';
import axios from 'axios';

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
    API_ENDPOINTS.FILES.UPLOAD,
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

      const onMySuccess = ({
        fileWithPreview,
      }: {
        fileWithPreview: FileWithPreview;
      }) => {
        if (!fileWithPreview?.id) {
          return;
        }
        updateFile(fileWithPreview.id, {
          progress: 100,
          status: 'success' as const,
        });
      };

      const onMyError = (error: Error) => {
        if (axios.isCancel(error)) {
          updateFile(fileWithPreview.id, { status: 'canceled' });
          return;
        }
        updateFile(fileWithPreview.id, { status: 'error' });
      };

      return promise
        .then(() => {
          onMySuccess({ fileWithPreview });
        }) // 🔑 리턴값은 onSuccess 에서 사용됨
        .catch((error) => {
          onMyError(error);
        }) // 🔑 여기서 throw 되면 onError 에서 사용됨
        .finally(() => {
          abortControllerRef.current.delete(fileWithPreview.id);
        });
    },
      {
        throwOnError: false,
        onSuccess: () => {
          // 🤔 여러 번 trigger를 연속적으로 호출하면, 내부적으로 마지막 mutation의 결과만을 처리되는 문제있음.
          // 그래서 내부에서 처리하는 함수를 따로 만들어서 사용함.
        },
        onError: () => {
          // 🤔 여러 번 trigger를 연속적으로 호출하면, 내부적으로 마지막 mutation의 결과만을 처리되는 문제있음.
          // 그래서 내부에서 처리하는 함수를 따로 만들어서 사용함.
        },
      }
  );

  return { trigger, isMutating, abort };
};
