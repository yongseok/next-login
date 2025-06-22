import { Button } from '@/components/ui/button';
import { Ban, RefreshCcw, X } from 'lucide-react';
import Image from 'next/image';
import { getFileIcon } from '@/lib/utils/getFileIcons';
import { formatFileSize } from '@/lib/utils/formatFileSize';
import { FileWithPreview } from '@/types/gallery';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { memo } from 'react';

function FileListItem({
  file,
  removeFile,
  abort,
  updateFile,
}: {
  file: FileWithPreview;
  removeFile: (id: string) => void;
  abort: (id: string) => void;
  updateFile: (id: string, file: Partial<FileWithPreview>) => void;
}) {
  const t = useTranslations('upload');

  return (
    <Card className='p-3 sm:p-4 group' id={`file-list-item-${file.id}`}>
      <div className='flex items-center gap-3 sm:gap-4'>
        {/* 파일 아이콘/미리보기 */}
        <div className='w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0'>
          {file.preview ? (
            <Image
              src={file.preview}
              alt={file.file.name}
              className='w-10 h-10 sm:w-12 sm:h-12 object-cover rounded'
              width={40}
              height={40}
            />
          ) : (
            <div className='h-10 w-10 sm:h-12 sm:w-12 rounded flex items-center justify-center'>
              {getFileIcon(file.file.type)}
            </div>
          )}
        </div>

        {/* 파일 정보 */}
        <div className='flex-1 min-w-0 overflow-hidden'>
          <p className='text-xs sm:text-sm font-medium '>
            {file.file.name || t('unknown file')}
          </p>
          <p className='text-xs text-gray-500'>
            {formatFileSize(file.file.size)}
          </p>

          {/* 업로드 진행률 */}
          {file.status === 'uploading' && file.progress !== undefined && (
            <div className='mt-1 w-full'>
              <Progress value={file.progress} />
            </div>
          )}
        </div>

        {/* 상태 배지 */}
        <div className='flex items-center gap-2'>
          {file.status === 'pending' && (
            <Badge variant='secondary' className='text-xs rounded-full'>
              {t('pending')}
            </Badge>
          )}
          {file.status === 'error' && (
            <Badge variant='destructive' className='text-xs rounded-full'>
              {t('error')}
            </Badge>
          )}
          {file.status === 'success' && (
            <Badge
              variant='default'
              className='text-xs bg-green-500 text-white rounded-full'
            >
              {t('success')}
            </Badge>
          )}
          {file.status === 'canceled' && (
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

          {file.status === 'uploading' && (
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
            disabled={file.status === 'uploading'}
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
