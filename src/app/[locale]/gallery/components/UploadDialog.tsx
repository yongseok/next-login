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
import SelectedItem from '../upload/components/selectedItem';

export default function UploadDialog() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{
    title: string;
    description: string;
    files: FileList;
  }>();
  console.log('🚀 | UploadDialog | errors:', errors);
  const selectedFiles = watch('files');

  const onSubmit = (data: {
    title: string;
    description: string;
    files: FileList;
  }) => {
    console.log('🚀 | onSubmit | data:', data);
  };

  const removeFile = (id: string) => {
    console.log(id);
  };

  return (
    <div>
      <Dialog open={true}>
        <DialogTrigger asChild>
          <Button variant='outline'>Upload</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                  {...register('description', {
                    required: 'Description is required',
                  })}
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
                  type='file'
                  multiple
                  {...register('files', { required: 'Files are required' })}
                />
                {errors.files && (
                  <p className='text-red-500 text-sm'>{errors.files.message}</p>
                )}
              </div>
              {/* Selected Files */}
              <Label htmlFor='selected-files'>Selected Files</Label>
              <ScrollArea className='w-full whitespace-nowrap rounded-md border-2 border-red-500'>
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className='flex w-max space-x-4 p-1'>
                    {Array.from(selectedFiles).map((file) => (
                      <div key={file.name} className=''>
                        <SelectedItem
                          key={file.name}
                          file={{
                            ...file,
                            id: crypto.randomUUID(),
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            status: 'pending',
                            preview: URL.createObjectURL(file),
                          }}
                          removeFile={removeFile}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <ScrollBar orientation='horizontal' />
              </ScrollArea>
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
