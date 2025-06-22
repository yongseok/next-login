import { useState, useCallback } from 'react';
import { FileWithPreview } from '@/types/gallery';
import { UseFormSetValue } from 'react-hook-form';

// 이 FormData는 UploadPage에 특화되어 있습니다.
// 더 재사용 가능한 훅을 만들려면 제네릭 타입으로 전달하는 것이 좋습니다.
type FormData = {
  title: string;
  description: string;
  files: File[];
};

/**
 * 파일 전송 상태 관리 훅
 * @param setValue 폼 값 설정 함수
 * @returns 파일 전송 상태 관리 함수
 */
export const useFileHandler = (setValue: UseFormSetValue<FormData>) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const updateFile = useCallback(
    (
      fileId: string,
      newProps: Partial<Omit<FileWithPreview, 'id' | 'file' | 'preview'>>
    ) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, ...newProps } : f))
      );
    },
    []
  );

  // 파일 목록에 추가
  const insertFiles = useCallback(
    (fileList: FileList) => {
      setFiles((prevFiles) => {
        const uniqueIncomingFiles = Array.from(fileList).filter(
          (incomingFile) =>
            !prevFiles.some(
              (prevFile) =>
                prevFile.file.name === incomingFile.name &&
                prevFile.file.size === incomingFile.size &&
                prevFile.file.type === incomingFile.type
            )
        );

        if (uniqueIncomingFiles.length === 0) {
          return prevFiles;
        }

        const newFilesWithPreview: FileWithPreview[] = uniqueIncomingFiles.map(
          (file) => {
            const fileWithPreview: FileWithPreview = {
              file,
              id: crypto.randomUUID(),
              status: 'pending',
            };
            if (file.type.startsWith('image/')) {
              fileWithPreview.preview = URL.createObjectURL(file);
            }
            return fileWithPreview;
          }
        );

        const updatedFiles = [...prevFiles, ...newFilesWithPreview];
        setValue(
          'files',
          updatedFiles.map((f) => f.file)
        );

        return updatedFiles;
      });
    },
    [setValue]
  );

  // 파일 목록에서 제거
  const removeFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => {
        const updatedFiles = prev.filter((file) => file.id !== fileId);
        setValue(
          'files',
          updatedFiles.map((f) => f.file)
        );
        return updatedFiles;
      });
    },
    [setValue]
  );

  // 모든 파일 제거
  const resetFiles = useCallback(() => {
    setFiles([]);
    setValue('files', []);
  }, [setValue]);

  return { files, insertFiles, removeFile, resetFiles, updateFile };
};
