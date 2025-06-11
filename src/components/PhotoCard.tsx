'use client';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';
import { useState } from 'react';

export default function PhotoCard({
  image,
}: {
  image: { id: number; url: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <figure className='shrink-0'>
      <div
        key={image.id}
        className='shadow-md transition-transform duration-300 hover:scale-103 hover:shadow-xl 
        overflow-hidden'
      >
        <div className='relative'>
          <div className='absolute top-0 left-0 w-full h-full'>
            <h4 className='text-center mt-2 text-sm text-card-foreground'>
              {image.id}
            </h4>
          </div>
        </div>
        {isLoading && <Skeleton className='h-[125px] w-[250px]' />}
        <Image
          src={image.url}
          alt={image.id.toString()}
          className='w-full h-80 object-cover'
          width={300}
          height={200}
          onLoadingComplete={() => {
            console.log('Loading complete');
            setIsLoading(false);
          }}
          hidden={isLoading}
        />
        {isLoading && <Skeleton className='h-[125px] w-[250px]' />}
        <figcaption className='text-muted-foreground pt-2 text-xs'>
          Discription: {image.id}
          <span className='text-foreground font-semibold'> Description</span>
        </figcaption>
      </div>
    </figure>
  );
}
