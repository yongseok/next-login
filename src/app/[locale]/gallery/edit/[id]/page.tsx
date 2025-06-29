'use client';

import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFileListState } from '@/lib/hooks/useFileListState';
import { useGetGalleryById } from '@/lib/swr/useGalleries';
import {
  DESCRIPTION_MAX_LENGTH,
  GalleryFormValues,
  gallerySchema,
} from '@/lib/validations/gallerySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { FileData } from '@/types/gallery';
import { useFileUpload } from '@/lib/swr/useFileUpload';
import FileListItem from '@/app/[locale]/gallery/upload/components/FileListItem';
import FileInput from '@/components/FileInput';

export default function GalleryEditPage() {
  const { id } = useParams();
  const { data: gallery, error, isLoading } = useGetGalleryById(id as string);

  /** 폼 상태 관리 & 유효성 검사 **/
  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: '',
      description: '',
      fileList: [],
    },
  });
  const {
    handleSubmit,
    formState: { errors },
  } = form;

  /** 파일 상태 관리 **/
  const {
    files,
    insertLocalFiles,
    insertServerFiles,
    updateTransfer,
    removeFile,
  } = useFileListState();

  /** 파일 업로드 관리 **/
  const { trigger, abort } = useFileUpload(updateTransfer);

  /** 서버에서 가져온 파일 추가 **/
  useEffect(() => {
    if (gallery) {
      insertServerFiles(
        gallery.files.map(
          (file: {
            id: string;
            filename: string;
            mimetype: string;
            size: number;
            url: string;
          }) => ({
            id: file.id,
            info: {
              filename: file.filename,
              mimetype: file.mimetype,
              size: file.size,
            },
            url: file.url,
          })
        )
      );
    }
  }, [gallery, insertServerFiles]);

  /** 로컬에서 선택한 파일 추가 **/
  useEffect(() => {
    if (files) {
      form.setValue('fileList', files);
    }
  }, [files, form]);

  /** 로컬에서 선택한 파일 업로드 **/
  useEffect(() => {
    const filesToUpload = files.filter(
      (file) => file.type === 'local' && file.transfer?.status === 'pending'
    );
    if (filesToUpload.length > 0) {
      filesToUpload.forEach((file) => {
        // 중복 실행을 막기 위해 상태를 즉시 변경하고 업로드를 트리거합니다.
        updateTransfer(file.id, { status: 'uploading', progress: 0 });
        trigger(file);
      });
    }
  }, [files, trigger, updateTransfer]);

  /** 폼 제출 **/
  const onSubmit = (data: GalleryFormValues) => {
    console.log('🚀 | GalleryEditPage | data:', data);
  };

  if (isLoading) {
    return <LoadingComponent message='갤러리를 불러오는 중...' />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <div className='w-full max-w-7xl mx-auto p-4 sm:p-6'>
      <h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'>
        GalleryEditPage {id}
      </h1>
      <Form {...form}>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          {/* 제목 */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium' htmlFor='title'>
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    aria-label='title'
                    placeholder='Input title'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs text-red-500'>
                  {errors.title?.message || ''}
                </FormMessage>
              </FormItem>
            )}
          />
          {/* 설명 */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className='text-sm font-medium'
                  htmlFor='description'
                >
                  {`Description (max ${DESCRIPTION_MAX_LENGTH} characters)`}
                </FormLabel>
                <FormControl>
                  <textarea
                    aria-label='description'
                    placeholder='Input description'
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs text-red-500'>
                  {errors.description?.message || ''}
                </FormMessage>
              </FormItem>
            )}
          />
          {/* 파일 리스트 */}
          <FormField
            control={form.control}
            name='fileList'
            render={({ field }) => {
              return (
                <div className='flex flex-col gap-2'>
                  {(field.value as unknown[] as FileData[])?.map((file) => {
                    if (!file.type || !file.info) return null;
                    return (
                      <FileListItem
                        key={file.id}
                        file={file}
                        removeFile={removeFile}
                        updateFile={updateTransfer}
                        abort={abort}
                      />
                    );
                  })}
                </div>
              );
            }}
          />
          <div className='flex flex-col sm:flex-row gap-4 justify-end content-center'>
            {/* 파일 추가 영역 */}
            <FileInput
              insertLocalFiles={insertLocalFiles}
            />
            {/* 제출 버튼 */}
            <Button className='flex w-full sm:w-auto justify-center content-center' type='submit'>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
