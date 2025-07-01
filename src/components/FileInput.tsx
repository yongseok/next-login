import { useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

export default function FileInput({
  insertLocalFiles,
  className,
  ...props
}: {
  insertLocalFiles: (files: FileList) => void;
  className?: string;
  [key: string]: unknown;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn(className)}>
      <Input
        type='file'
        {...props}
        multiple
        onChange={(e) => {
          if (e.target.files) {
            insertLocalFiles(e.target.files);
          }
        }}
        className='hidden'
        ref={inputRef}
        accept='*/*'
      />
      <Button
        type='button'
        className='w-full sm:w-auto hover:cursor-pointer'
        onClick={() => inputRef.current?.click()}
      >
        파일 선택
      </Button>
    </div>
  );
}
