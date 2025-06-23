import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import FileCard from '../upload/components/FileCard';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { FileWithPreview } from '@/types/gallery';

export default function UploadDialog() {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<{
    title: string;
    description: string;
    files: FileList;
  }>();

  const onSubmit = (data: {
    title: string;
    description: string;
    files: FileList;
  }) => {
    console.log('🚀 | onSubmit | data:', data);
    if (selectedFiles.length === 0) {
      setError('files', {
        type: 'required',
        message: 'Please select at least one file',
      });
      return;
    }
    const uploadPromises = selectedFiles
      .filter((file) => file.status !== 'success')
      .map(simulateUpload);
    Promise.all(uploadPromises).then((results) => {
      console.log('🚀 | onSubmit | results:', results);
    });
  };

  const simulateUpload = (file: FileWithPreview) => {
    let progress = 0;
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (progress >= 100) {
          clearInterval(interval);
          setSelectedFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === file.id ? { ...f, status: 'error', progress: 100 } : f
            )
          );
          resolve();
        } else {
          progress += Math.random() * 10;
          setSelectedFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    progress,
                    status: 'uploading',
                  }
                : f
            )
          );
        }
      }, 300);
    });
  };

  const removeFile = (id: string) => {
    setSelectedFiles(selectedFiles.filter((file) => file.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles((prevFiles) => {
      const existSet = new Set(
        prevFiles.map((file) => `${file.file.name}_${file.file.size}`)
      );
      const newFiles: FileWithPreview[] = Array.from(e.target.files || [])
        .filter((file) => !existSet.has(`${file.name}_${file.size}`))
        .map((file) => ({
          file,
          id: crypto.randomUUID(),
          preview: file.type.startsWith('image')
            ? URL.createObjectURL(file)
            : undefined,
          status: 'pending',
        }));

      const newFileList = [...prevFiles, ...newFiles];
      return newFileList;
    });
  };

  const onReset = () => {
    setSelectedFiles([]);
    reset();
  };

  return (
    <div>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            onReset();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant='outline'>Upload</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-7xl overflow-y-auto'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <DialogHeader>
              <DialogTitle>File Upload</DialogTitle>
              <DialogDescription>
                Upload files to your gallery.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4'>
              <div className='grid gap-3'>
                <Label htmlFor='title'>Title</Label>
                <Input
                  id='title'
                  placeholder='타이틀을 입력해주세요'
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && (
                  <p className='text-red-500 text-sm'>{errors.title.message}</p>
                )}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='description'>Description</Label>
                <Input
                  id='description'
                  placeholder='설명을 입력해주세요.(선택)'
                  {...register('description')}
                />
                {errors.description && (
                  <p className='text-red-500 text-sm'>
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='files'>Files</Label>
                <Input
                  id='file-input'
                  hidden={true}
                  type='file'
                  multiple
                  {...register('files', {
                    onChange: handleFileChange,
                  })}
                />
                <Button asChild variant='outline'>
                  {/* htmlFor 속성으로 input 태그의 id를 연결해줘 파일 선택 버튼을 클릭하면 input 태그가 클릭되도록 함 */}
                  <label htmlFor='file-input' className='cursor-pointer'>
                    <Plus className='w-4 h-4 mr-2' />
                    파일 선택
                  </label>
                </Button>
                {errors.files && (
                  <p className='text-red-500 text-sm'>{errors.files.message}</p>
                )}
              </div>
              {/* Selected Files */}
              <div className='w-full max-w-full overflow-x-auto whitespace-nowrap rounded-md space-y-2 gap-2'>
                <Label htmlFor='selected-files' className='text-sm'>
                  Selected Files
                </Label>
                {selectedFiles && selectedFiles.length > 0 && (
                  <>
                    <ScrollArea>
                      <div className='flex w-full space-x-4 p-1'>
                        {Array.from(selectedFiles).map((file) => (
                          <div key={file.file.name} className=''>
                            <FileCard
                              key={file.file.name}
                              file={file}
                              removeFile={removeFile}
                            />
                          </div>
                        ))}
                      </div>
                      <ScrollBar orientation='horizontal' />
                    </ScrollArea>
                    <div className='mt-4 text-center'>
                      <p className='text-xs text-gray-400'>
                        총 {selectedFiles.length}개의 파일 • 전송완료:{' '}
                        {selectedFiles.reduce(
                          (acc, f) => acc + (f.status === 'success' ? 1 : 0),
                          0
                        )}
                        개 • 전송중:{' '}
                        {selectedFiles.reduce(
                          (acc, f) => acc + (f.status === 'uploading' ? 1 : 0),
                          0
                        )}
                        개 • 취소:{' '}
                        {selectedFiles.reduce(
                          (acc, f) => acc + (f.status === 'canceled' ? 1 : 0),
                          0
                        )}
                        개 • 오류:{' '}
                        {selectedFiles.reduce(
                          (acc, f) => acc + (f.status === 'error' ? 1 : 0),
                          0
                        )}
                        개
                      </p>
                      <p className='text-xs text-gray-400'>
                        가로 스크롤로 더 많은 파일을 확인하세요
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <Button type='submit'>Upload</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
