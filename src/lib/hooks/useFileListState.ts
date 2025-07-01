import { useState, useCallback } from 'react';
import {
  FileData,
  FileTransferInfo,
  LocalFile,
  ServerFile,
} from '@/types/gallery';

const log = (message: string, data?: unknown, print: boolean = false) => {
  if (print) {
    console.log('[useFileListState]', message, data);
  }
};

/**
 * 파일 전송 상태 관리 훅
 */
export const useFileListState = () => {
  const [files, setFiles] = useState<FileData[]>([]);

  const updateTransfer = useCallback(
    (fileId: string, newStatus: Partial<FileTransferInfo>) => {
      setFiles((prev) => {
        const newFiles = prev.map((fileInfo) =>
          fileInfo.id === fileId && fileInfo.type === 'local'
            ? {
                ...fileInfo,
                transfer: { ...fileInfo.transfer, ...newStatus },
              }
            : fileInfo
        );
        log('updateTransfer:', newFiles);
        return newFiles;
      });
    },
    []
  );

  // 파일 목록에 추가
  const insertLocalFiles = useCallback((fileList: FileList) => {
    setFiles((prevFiles) => {
      const uniqueIncomingFiles = Array.from(fileList).filter(
        (incomingFile) =>
          !prevFiles.some(
            (prevFile) =>
              prevFile.type === 'local' &&
              prevFile.info.filename === incomingFile.name &&
              prevFile.info.size === incomingFile.size &&
              prevFile.info.mimetype === incomingFile.type
          )
      );

      if (uniqueIncomingFiles.length === 0) {
        return prevFiles;
      }

      const newLocalFiles: LocalFile[] = uniqueIncomingFiles.map((file) => {
        const fileWithPreview: LocalFile = {
          id: crypto.randomUUID(),
          type: 'local',
          info: {
            filename: file.name,
            mimetype: file.type,
            size: file.size,
          },
          file,
          transfer: {
            status: 'pending',
            progress: 0,
          },
        };
        if (
          file.type.startsWith('image/') &&
          fileWithPreview.type === 'local'
        ) {
          fileWithPreview.previewUrl = URL.createObjectURL(file);
        }
        return fileWithPreview;
      });

      const updatedFiles = [...prevFiles, ...newLocalFiles];
      log('insertLocalFiles:', updatedFiles);
      return updatedFiles;
    });
  }, []);

  const insertServerFiles = useCallback((fileList: ServerFile[] = []) => {
    setFiles((prevFiles) => {
      const uniqueIncomingFiles = fileList?.filter(
        (file) => !prevFiles.some((prevFile) => prevFile.id === file.id)
      );
      console.log('🚀 | setFiles | uniqueIncomingFiles:', uniqueIncomingFiles);

      if (uniqueIncomingFiles.length === 0) {
        return prevFiles;
      }

      const newServerFiles: ServerFile[] = uniqueIncomingFiles.map((file) => ({
        id: file.id,
        type: 'server',
        info: {
          filename: file.info.filename,
          mimetype: file.info.mimetype,
          size: file.info.size,
        },
        url: file.url,
      }));
      const updatedFiles = [...prevFiles, ...newServerFiles];
      log('insertServerFiles:', updatedFiles);
      return updatedFiles;
    });
  }, []);

  // 파일 목록에서 제거
  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const removedFile = prev.find((file) => file.id === fileId);
      if (removedFile?.type === 'local' && removedFile.previewUrl) {
        URL.revokeObjectURL(removedFile.previewUrl);
      }
      const updatedFiles = prev.filter((file) => file.id !== fileId);
      log('removeFile:', updatedFiles);
      return updatedFiles;
    });
  }, []);

  // 모든 파일 제거
  const resetFiles = useCallback(() => {
    files.forEach((file) => {
      if (file.type === 'local' && file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    log('resetFiles:', []);
    setFiles([]);
  }, [files]);

  return {
    files,
    insertLocalFiles,
    insertServerFiles,
    updateTransfer,
    removeFile,
    resetFiles,
  };
};
