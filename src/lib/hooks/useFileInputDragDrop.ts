import { useCallback, useState } from 'react';

/**
 * 파일 드롭 영역 상태 관리
 * @param insertFiles 파일 삽입 함수
 * @returns 파일 드롭 영역 상태 관리
 *
 * @example
 * const { isDragOver, handleDrop, handleDragOver, handleDragLeave } =
 *   useFileInputDragDrop({ insertFiles });
 * // 파일 드롭 영역 상태 관리
 * <div
 *   onDrop={handleDrop}
 *   onDragOver={handleDragOver}
 *   onDragLeave={handleDragLeave}
 * >
 * </div>
 */
export default function useFileInputDragDrop({
  insertFiles,
}: {
  insertFiles: (files: FileList) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        insertFiles(droppedFiles);
      }
    },
    [insertFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return { isDragOver, handleDrop, handleDragOver, handleDragLeave };
}
