import useSWRMutation from 'swr/mutation';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { FileData, FileTransferInfo } from '@/types/gallery';
import { uploadFileWithPreview } from './fetcher';
import { useCallback, useRef } from 'react';
import axios from 'axios';

/**
 * 파일 업로드 처리
 * @param updateFile 파일 상태 업데이트 함수
 * @returns 파일 업로드 트리거 함수와 업로드 중 여부
 */
export const useFileUpload = (
  updateFile: (id: string, status: Partial<FileTransferInfo>) => void
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
    (url, { arg: fileData }: { arg: FileData }) => {
      const abortController = new AbortController();
      abortControllerRef.current.set(fileData.id, abortController);

      const promise = uploadFileWithPreview(
        url,
        fileData,
        abortController.signal,
        (progress: number) => {
          updateFile(fileData.id, {
              progress,
              status: 'uploading',
          });
        }
      );

      const onMySuccess = ({
        fileData,
      }: {
        fileData: FileData;
      }) => {
        if (!fileData?.id) {
          return;
        }
        updateFile(fileData.id, {
            progress: 100,
            status: 'success',
        });
      };

      const onMyError = (error: Error) => {
        if (axios.isCancel(error)) {
          updateFile(fileData.id, {
              status: 'canceled'
          });
          return;
        }
        updateFile(fileData.id, { status: 'error' });
      };

      return promise
        .then(() => {
          onMySuccess({ fileData });
        }) // 🔑 리턴값은 onSuccess 에서 사용됨
        .catch((error) => {
          onMyError(error);
        }) // 🔑 여기서 throw 되면 onError 에서 사용됨
        .finally(() => {
          abortControllerRef.current.delete(fileData.id);
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
