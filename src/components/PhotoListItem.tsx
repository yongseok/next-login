import { formatFileSize } from '@/lib/utils/formatFileSize';
import Image from 'next/image';

export type PhotoEntityProps = {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
};
export default function PhotoListItem({
  id,
  url,
  filename,
  mimetype,
  size,
}: PhotoEntityProps) {
  return (
    <div key={id} className='flex gap-2 items-center'>
      <Image
        src={url}
        alt={filename}
        width={100}
        height={100}
        className='object-cover rounded-md w-20 h-20'
      />
      <div className='flex flex-col gap-1'>
        <p className='text-sm text-muted-foreground'>{filename}</p>
        <p className='text-sm text-muted-foreground'>{mimetype}</p>
        <p className='text-xs text-muted-foreground'>{formatFileSize(size)}</p>
      </div>
    </div>
  );
}
