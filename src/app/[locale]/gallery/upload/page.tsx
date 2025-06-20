'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { FileWithPreview } from '@/types/gallery';
import { Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import FileListItem from './components/FileListItem';
import { toast } from 'sonner';

type FormData = {
  title: string;
  description: string;
  files: File[];
};

export default function UploadPage() {
  const t = useTranslations('upload');
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      files: [],
    },
  });

  const processFiles = useCallback(
    (fileList: FileList) => {
      setFiles((prev) => {
        const newFiles: FileWithPreview[] = Array.from(fileList).reduce(
          (acc: FileWithPreview[], file) => {
            if (
              prev.some(
                (f) =>
                  f.name === file.name &&
                  f.size === file.size &&
                  f.type === file.type
              )
            ) {
              return acc;
            } else {
              const fileWithPreview = file as FileWithPreview;
              fileWithPreview.id = crypto.randomUUID();
              fileWithPreview.status = 'pending';
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
        setValue('files', updatedFiles);
        return updatedFiles;
      });
    },
    [setValue]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        processFiles(selectedFiles);
      }
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => {
        const updatedFiles = prev.filter((file) => file.id !== fileId);
        setValue('files', updatedFiles);
        return updatedFiles;
      });
    },
    [setValue]
  );

  const simulateUpload = async (file: FileWithPreview): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        try {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id ? { ...f, status: 'success' } : f
              )
            );
            resolve();
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id ? { ...f, progress, status: 'uploading' } : f
              )
            );
          }
        } catch (error) {
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, status: 'error' } : f))
          );
          reject(error);
        }
      }, 200);
    });
  };

  const uploadFile = async (file: FileWithPreview) => {
    const formData = new FormData();
    formData.append('file', file as Blob, file.name);

    const response = await fetch('/api/gallery/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload files');
    }
  };

  const onSubmit = async (data: FormData) => {
    if (files.length === 0) {
      alert(t('noFilesSelected'));
      return;
    }

    setIsUploading(true);
    try {
      console.log('🚀 | onSubmit | data:', data);
      await Promise.all(files.map(uploadFile));
      toast.success(t('uploadSuccess'));
    } catch (error) {
      console.error('[UploadPage][onSubmit]', error);
      toast.error(t('uploadError'));
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className='w-full max-w-7xl mx-auto p-4 sm:p-6'>
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* 기본 정보 입력 */}
            <div className='space-y-2'>
              <Label htmlFor='title'>{t('titlelabel')}</Label>
              <Input
                id='title'
                disabled={isUploading}
                placeholder={t('titlePlaceholder')}
                {...register('title', { required: t('titleRequired') })}
              />
              {errors.title && (
                <p className='text-red-500 text-sm'>{errors.title.message}</p>
              )}
              <div className='space-y-2'>
                <Label htmlFor='description'>{t('descriptionlabel')}</Label>
                <Input
                  id='description'
                  disabled={isUploading}
                  placeholder={t('descriptionPlaceholder')}
                  {...register('description')}
                />
                {errors.description && (
                  <p className='text-red-500'>{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* 파일 드롭 영역 */}
            <div className='relative'>
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
                  <p className='text-base sm:text-lg font-medium'>
                    {t('dragAndDrop')}
                  </p>
                  <p className='text-xs sm:text-sm text-gray-500'>
                    {t('supportedFormats')}
                  </p>
                </div>
                <Input
                  type='file'
                  multiple
                  onChange={handleFileInput}
                  className='hidden'
                  id='file-input'
                  accept='*/*'
                />
                <Button
                  type='button'
                  className='mt-3 sm:mt-4 w-full sm:w-auto hover:cursor-pointer'
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  파일 선택
                </Button>
              </div>
              {isUploading && (
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

            {/* 선택된 파일 목록 */}
            {files.length > 0 && (
              <div className='space-y-3 sm:space-y-4'>
                <h3 className='text-base sm:text-lg font-medium'>
                  선택된 파일 ({files.length}개)
                </h3>
                <div className='space-y-2 sm:space-y-3'>
                  {files.map((file) => (
                    <FileListItem
                      key={file.id}
                      file={file}
                      removeFile={removeFile}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* 제출 버튼 */}
            <div className='flex flex-col sm:flex-row justify-end gap-2 mt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setFiles([])}
                disabled={isUploading}
              >
                {t('cancel')}
              </Button>
              <Button type='submit' disabled={isUploading}>
                {isUploading
                  ? t('uploading')
                  : t('submit', { count: files.length })}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
