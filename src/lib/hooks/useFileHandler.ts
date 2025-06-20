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

export const useFileHandler = (setValue: UseFormSetValue<FormData>) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  // 파일 목록에 추가
  const processFiles = useCallback(
    (fileList: FileList) => {
      setFiles((prev) => {
        const newFiles: FileWithPreview[] = Array.from(fileList).reduce(
          (acc: FileWithPreview[], file) => {
            // 중복 파일 체크
            if (
              prev.some(
                (f) =>
                  f.file.name === file.name &&
                  f.file.size === file.size &&
                  f.file.type === file.type
              )
            ) {
              return acc;
            } else {
              const fileWithPreview: FileWithPreview = {
                file: file,
                id: crypto.randomUUID(),
                status: 'pending',
              };

              // 이미지 파일인 경우 미리보기 생성
              if (file.type.startsWith('image/')) {
                fileWithPreview.preview = URL.createObjectURL(file);
              }
              return [...acc, fileWithPreview];
            }
          },
          []
        );
        const updatedFiles = [...prev, ...newFiles];
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

  return { files, setFiles, processFiles, removeFile, resetFiles };
};
