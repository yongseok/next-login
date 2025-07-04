import { galleryService } from '@/lib/services/galleries.service';
import Image from 'next/image';

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let gallery = null;

  try {
    gallery = await galleryService.getGalleryById(id);
    if (!gallery) {
      return <div>GalleryDetailPage {id} not found</div>;
    }
  } catch (error) {
    console.error('🚀 | GalleryDetailPage | error:', error);
    return <div>GalleryDetailPage {id} error</div>;
  }
  return (
    <div className='flex flex-col gap-6 p-6 max-w-2xl mx-auto'>
      <h1 className='text-3xl font-extrabold mb-2 border-b pb-2'>
        갤러리 디테일 페이지
      </h1>
      <div className='mb-4'>
        <h3 className='text-xl font-semibold mb-1'>{gallery.title}</h3>
        <p className='text-base text-muted-foreground'>
          {gallery.description || ''}
        </p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {gallery.files?.map((file) => (
          <div
            key={file.id}
            className='bg-background rounded-xl shadow-md p-4 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg border border-gray-100 hover:cursor-pointer'
          >
            <div className='w-full flex justify-center mb-2'>
              <Image
                src={`${process.env.NEXT_PUBLIC_URL}${file.url}`}
                alt={file.filename}
                width={200}
                height={200}
                className='rounded-lg object-cover aspect-square transition-all duration-200 hover:brightness-90'
              />
            </div>
            <p className='text-sm text-muted-foreground font-medium truncate w-full text-center'>
              {file.filename}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
