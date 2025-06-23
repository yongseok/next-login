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
import { Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FileListItem from './components/FileListItem';
import { toast } from 'sonner';
import { useFileHandler } from '@/lib/hooks/useFileHandler';
import { useFileUpload } from '@/lib/swr/useFile';
import { useSession } from 'next-auth/react';

type FormData = {
  title: string;
  description: string;
  files: File[];
};
/*
 * 기능 구현 예정
 * [x] swr 통합
 * [ ] 취소, 재전송
 * [ ] 갤러리 데이터 저장
 *   - [ ] 임시 저장 파일 삭제 처리(https://grok.com/share/bGVnYWN5_0a3cf627-aac4-4090-9c50-8eff75690b2f)
 */
export default function UploadPage() {
  const { data: session } = useSession();
  console.log('🚀 | UploadPage | session:', session);
  
  const t = useTranslations('upload');
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

  const { files, insertFiles, removeFile, resetFiles, updateFile } =
    useFileHandler(setValue);

  const { trigger, isMutating, abort } = useFileUpload(updateFile);

  /**
   * 파일 업로드 부수 효과(side effect) 처리.
   *
   * 이 `useEffect`는 `files` 상태가 변경될 때마다 실행되어,
   * 'pending' 상태인 파일들을 찾아 업로드를 시작합니다.
   *
   * @reason 역할 분리 및 선언적 프로그래밍
   * `useFileHandler`의 `insertFiles` 함수에서 `onFilesInserted` 콜백을 제거하고,
   * 이제 순수하게 파일 목록 '상태를 변경하는' 책임만 담당하도록 수정했습니다.
   *
   * 실제 업로드 로직(부수 효과)은 이 `useEffect`가 전담하여 처리합니다.
   * 이렇게 상태 관리 로직과 부수 효과 로직을 명확히 분리함으로써,
   * React의 StrictMode에서 발생하는 중복 실행 문제를 해결하고
   * 상태 동기화의 복잡성을 피해 코드를 더 견고하고 예측 가능하게 만듭니다.
   */
  useEffect(() => {
    const filesToUpload = files.filter((file) => file.status === 'pending');
    if (filesToUpload.length > 0) {
      filesToUpload.forEach((file) => {
        // 중복 실행을 막기 위해 상태를 즉시 변경하고 업로드를 트리거합니다.
        updateFile(file.id, { status: 'uploading', progress: 0 });
        trigger(file);
      });
    }
  }, [files, trigger, updateFile]);

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

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        insertFiles(selectedFiles);
      }
    },
    [insertFiles]
  );

  const onSubmit = async (data: FormData) => {
    const isStillUploading = files.some((file) => file.status === 'uploading');
    if (isStillUploading) {
      toast.error(
        '아직 업로드 중인 파일이 있습니다. 잠시 후 다시 시도해주세요.'
      );
      return;
    }

    const successfulUploads = files.filter((file) => file.status === 'success');

    if (successfulUploads.length === 0) {
      toast.error('업로드된 파일이 없습니다.');
      return;
    }

    if (files.some((file) => file.status === 'error')) {
      toast.error('오류가 발생한 파일이 있습니다. 확인 후 다시 시도해주세요.');
      return;
    }

    // TODO: 갤러리 생성 API 호출
    // data.title, data.description, successfulUploads 정보를 사용
    console.log('Creating gallery with:', {
      ...data,
      files: successfulUploads,
    });
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('fileList', JSON.stringify(successfulUploads.map((file) => file.id)));

    const response = await fetch('/api/galleries', {
      method: 'POST',
      // body: JSON.stringify({
      //   title: data.title,
      //   description: data.description,
      //   fileList: successfulUploads.map((file) => file.id),
      // }),
      body: formData,
    });
    if (response.ok) {
      toast.success('갤러리 정보를 성공적으로 제출했습니다. (콘솔 로그 확인)');
    } else {
      toast.error('갤러리 정보 제출에 실패했습니다. 다시 시도해주세요.');
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
                disabled={isMutating}
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
                  disabled={isMutating}
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
                      abort={abort}
                      updateFile={updateFile}
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
                onClick={resetFiles}
                disabled={isMutating}
              >
                {t('cancel')}
              </Button>
              <Button type='submit' disabled={isMutating}>
                {isMutating
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
