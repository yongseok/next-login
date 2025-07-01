import { Button } from '@/components/ui/button';
import { Ban, RefreshCcw, X } from 'lucide-react';
import Image from 'next/image';
import { getFileIcon } from '@/lib/utils/getFileIcons';
import { formatFileSize } from '@/lib/utils/formatFileSize';
import { FileData, FileTransferInfo } from '@/types/gallery';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { memo } from 'react';
import path from 'path';

/**
 * 파일 리스트 아이템 상태 관리
 * @param file 파일 데이터
 * @param removeFile 파일 삭제 함수
 * @param updateFile 파일 상태 업데이트 함수
 */
function FileListItem({
  file,
  removeFile,
  updateFile,
  abort,
}: {
  file: FileData;
  removeFile: (id: string) => void;
  updateFile: (id: string, status: Partial<FileTransferInfo>) => void;
  abort: (id: string) => void;
}) {
  const t = useTranslations('upload');

  let src = '';
  if (file.type === 'server' && file.url) {
    src = path.join(process.env.NEXT_PUBLIC_URL!, file.url);
  } else if (file.type === 'local' && file.previewUrl) {
    src = file.previewUrl;
  }

  return (
    <Card className='p-3 sm:p-4 group' id={`file-list-item-${file.id}`}>
      <div className='flex items-center gap-3 sm:gap-4'>
        {/* 파일 아이콘/미리보기 */}
        <div className='w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0'>
          {src ? (
            <Image
              src={src}
              alt={file.info.filename}
              className='w-10 h-10 sm:w-12 sm:h-12 object-cover rounded'
              width={40}
              height={40}
            />
          ) : (
            <div className='h-10 w-10 sm:h-12 sm:w-12 rounded flex items-center justify-center'>
              {getFileIcon(file.info.mimetype)}
            </div>
          )}
        </div>

        {/* 파일 정보 */}
        <div className='flex-1 min-w-0 overflow-hidden'>
          <p className='text-xs sm:text-sm font-medium '>
            {file.info.filename || t('unknown file')}
          </p>
          <p className='text-xs text-gray-500'>
            {formatFileSize(file.info.size)}
          </p>

          {/* 업로드 진행률 */}
          {file.type === 'local' &&
            file.transfer?.status === 'uploading' &&
            file.transfer?.progress !== undefined && (
              <div className='mt-1 w-full'>
                <Progress value={file.transfer.progress} />
              </div>
            )}
        </div>

        {/* 상태 배지 */}
        <div className='flex items-center gap-2'>
          {file.type === 'local' && file.transfer?.status === 'pending' && (
            <Badge variant='secondary' className='text-xs rounded-full'>
              {t('pending')}
            </Badge>
          )}
          {file.type === 'local' && file.transfer?.status === 'error' && (
            <div className='flex items-center gap-2'>
              <Badge
                variant='destructive'
                className='group-hover:hidden text-xs rounded-full'
              >
                {t('error')}
              </Badge>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='hidden group-hover:block h-8 w-8 p-0 hover:cursor-pointer'
                onClick={() => updateFile(file.id, { status: 'pending' })}
              >
                <RefreshCcw className='w-4 h-4' />
              </Button>
            </div>
          )}
          {file.type === 'local' && file.transfer?.status === 'success' && (
            <Badge
              variant='default'
              className='text-xs bg-green-500 text-white rounded-full'
            >
              {t('success')}
            </Badge>
          )}
          {file.type === 'local' && file.transfer?.status === 'canceled' && (
            <div className='flex items-center gap-2'>
              <Badge
                variant='destructive'
                className='group-hover:hidden text-xs rounded-full'
              >
                {t('canceled')}
              </Badge>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='hidden group-hover:block h-8 w-8 p-0 hover:cursor-pointer'
                onClick={() => updateFile(file.id, { status: 'pending' })}
              >
                <RefreshCcw className='w-4 h-4' />
              </Button>
            </div>
          )}

          {file.type === 'local' && file.transfer?.status === 'uploading' && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0'
              onClick={() => abort(file.id)}
            >
              <Ban />
            </Button>
          )}

          {/* 삭제 버튼 */}
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0'
            disabled={
              file.type === 'local' && file.transfer?.status === 'uploading'
            }
            onClick={() => removeFile(file.id)}
          >
            <X />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default memo(FileListItem);
