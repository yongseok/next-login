import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';
import ActionButton from './ActionButton';

interface MediaItemProps {
  id: number;
  type: 'image' | 'video';
  title: string;
  category: string;
  tags: string[];
  thumbnail: string;
  likes?: number;
  downloads?: number;
  duration?: string;
  width: number;
  height: number;
  onClick: () => void;
  toggleLike: (id: number) => void;
  likedItems: number[];
}

export default function MediaList({
  id,
  type,
  title,
  category,
  tags,
  thumbnail,
  likes,
  downloads,
  duration,
  width,
  height,
  onClick,
  toggleLike,
  likedItems,
}: MediaItemProps) {
  console.log(
    id,
    type,
    title,
    category,
    tags,
    thumbnail,
    likes,
    downloads,
    duration,
    width,
    height
  );
  return (
    <Card className='overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow py-0'>
      <CardContent className='p-0'>
        <div className='flex gap-4 p-4'>
          <div className='relative w-32 h-20 flex-shrink-0 overflow-hidden rounded-lg'>
            <Image
              src={thumbnail || '/placeholder.svg'}
              alt={title}
              fill
              className='w-full h-full object-cover hover:cursor-pointer'
              onClick={onClick}
            />
            {type === 'video' && duration && (
              <Badge className='absolute bottom-1 right-1 text-xs bg-black/70 text-white'>
                {duration}
              </Badge>
            )}
          </div>

          <div className='flex-1 min-w-0'>
            <h3 className='font-semibold text-primary mb-1'>{title}</h3>
            <p className='text-sm text-muted-foreground mb-2'>{category}</p>

            <div className='flex flex-wrap gap-1 mb-2'>
              {tags.map((tag) => (
                <Badge key={tag} variant='outline' className='text-xs'>
                  {tag}
                </Badge>
              ))}
            </div>

            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              <span className='flex items-center gap-1'>
                <Heart className='w-3 h-3' />
                {likes}
              </span>
              <span className='flex items-center gap-1'>
                <Download className='w-3 h-3' />
                {downloads}
              </span>
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <ActionButton onClick={() => toggleLike(id)}>
              <Heart
                className={`w-4 h-4 ${
                  likedItems.includes(id) ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </ActionButton>
            <ActionButton>
              <Share2 className='w-4 h-4' />
            </ActionButton>
            <ActionButton>
              <Download className='w-4 h-4' />
            </ActionButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
