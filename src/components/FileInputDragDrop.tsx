import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FileInputDragDrop({
  isDragOver,
  isMutating,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  children,
}: {
  isDragOver: boolean;
  isMutating: boolean;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}) {
  const t = useTranslations('FileInputDragDrop');

  return (
    <div className='relative'>
      {/* 파일 드롭 영역 */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className='mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4' />
        <div className='space-y-2'>
          <p className='text-base sm:text-lg font-medium'>{t('dragAndDrop')}</p>
          <p className='text-xs sm:text-sm text-gray-500'>
            {t('supportedFormats')}
          </p>
        </div>
        {/* 파일 선택 버튼 */}
        {children}
      </div>
      {isMutating && (
        <div
          className='absolute inset-0 z-10 cursor-not-allowed'
          style={{
            background: 'rgba(255,255,255,0.5)',
            pointerEvents: 'all',
          }}
          aria-label='업로드 중에는 드래그 앤 드롭이 비활성화됩니다.'
        ></div>
      )}
    </div>
  );
}
