'use client';

import PhotoListItem from '@/components/PhotoListItem';
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
import path from 'path';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function GalleryEditPage() {
  const params = useParams();
  const { id } = params;

  const { data: gallery, error, isLoading } = useGetGalleryById(id as string);
  console.log('🚀 | GalleryEditPage | gallery:', gallery);

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

  useEffect(() => {
    if (gallery) {
      form.reset({
        title: gallery.title,
        description: gallery.description,
        fileList: gallery.files,
      });
    }
  }, [gallery, form]);

  const onSubmit = (data: GalleryFormValues) => {
    console.log('🚀 | GalleryEditPage | data:', data);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin'></div>
          <p className='text-sm text-muted-foreground'>
            갤러리를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-red-100 flex items-center justify-center'>
            <svg
              className='w-6 h-6 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              오류가 발생했습니다
            </h3>
            <p className='text-sm text-muted-foreground max-w-md'>
              {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>GalleryEditPage {id}</div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <FormField
            control={form.control}
            name='fileList'
            render={({ field }) => {
              console.log('🚀 | GalleryEditPage | field:', field.value);
              return (
                <div className='flex flex-col gap-2'>
                  {field.value?.map((file) => {
                    const src = path.join(
                      process.env.NEXT_PUBLIC_URL!,
                      file.url
                    );
                    return (
                      <div key={file.id}>
                        <PhotoListItem
                          id={file.id}
                          url={src}
                          filename={file.filename}
                          mimetype={file.mimetype}
                          size={file.size}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            }}
          />
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </div>
  );
}
