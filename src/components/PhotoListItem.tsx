import { formatFileSize } from '@/lib/utils/formatFileSize';
import Image from 'next/image';
import { Button } from './ui/button';
import { Loader2, Repeat2, Trash2, X } from 'lucide-react';
import { TRANSFER_STATUS_ENUM } from '@/types/gallery';
import { memo } from 'react';

export type TransferFileType = {
  type: 'local' | 'server';
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  status?: (typeof TRANSFER_STATUS_ENUM)[number];
  progress?: number;
};

export type TransferFileProps = {
  file: TransferFileType;
  remove?: (id: string) => void;
  abort?: (id: string) => void;
  upload?: (id: string) => void;
};

function PhotoListItem({
  file,
  remove,
  abort,
  upload,
}: TransferFileProps) {
  return (
    <div key={file.id} className='flex gap-2 items-center'>
      <Image
        src={file.url}
        alt={file.filename}
        width={100}
        height={100}
        className='object-cover rounded-md w-20 h-20'
      />
      <div className='flex flex-col gap-1'>
        <p className='text-sm text-muted-foreground'>{file.filename}</p>
        <p className='text-sm text-muted-foreground'>{file.mimetype}</p>
        <p className='text-xs text-muted-foreground'>
          {formatFileSize(file.size)}
        </p>
      </div>
      <div className='flex gap-2 ml-auto'>
        {file.status === 'uploading' && (
          <Button variant='outline' size='icon'>
            <Loader2 className='animate-spin' /> {file.progress}%
          </Button>
        )}
        {remove && (
          <Button variant='outline' size='icon' onClick={() => remove(file.id)}>
            <Trash2 />
          </Button>
        )}
        {upload && (file.status !== 'uploading' && file.status !== 'success') && (
          <Button variant='outline' size='icon' onClick={() => upload(file.id)}>
            <Repeat2 />
          </Button>
        )}
        {abort && (
          <Button variant='outline' size='icon' onClick={() => abort(file.id)}>
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}

export default memo(PhotoListItem);