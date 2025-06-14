import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Heart, Play, Share2 } from 'lucide-react';
import Image from 'next/image';
import ActionButton from './ActionButton';
import { MediaItem } from '@/types/gallery';

interface MediaItemProps {
  item: MediaItem;
  likedItems: number[];
  openMediaModal: () => void;
  toggleLike: () => void;
  onCopyLink: () => void;
  onDownload: () => void;
}

export default function MediaCard({
  item,
  likedItems,
  openMediaModal,
  toggleLike,
  onCopyLink,
  onDownload,
}: MediaItemProps) {
  const {
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
  } = item;
  return (
    <Card className='group overflow-hidden p-0 border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 gap-0'>
      <div className='relative overflow-hidden'>
        <Image
          src={thumbnail || '/placeholder.svg'}
          alt={title}
          width={width}
          height={height}
          className='w-full h-98 object-cover transition-transform duration-300 group-hover:scale-110 hover:cursor-pointer'
          onClick={openMediaModal}
        />

        {/* Video Play Button */}
        {type === 'video' && (
          <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
            <Button
              size='icon'
              variant='default'
              className='w-12 h-12 rounded-full bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground hover:cursor-pointer opacity-80 hover:opacity-100 transition-opacity'
              onClick={openMediaModal}
            >
              <Play className='w-10 h-10' />
            </Button>
          </div>
        )}

        {/* Overlay Actions */}
        <div className='absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
          <ActionButton onClick={toggleLike}>
            <Heart
              className={`w-4 h-4 ${
                likedItems.includes(id) ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </ActionButton>
          <ActionButton onClick={onCopyLink}>
            <Share2 className='w-4 h-4' />
          </ActionButton>
          <ActionButton onClick={onDownload}>
            <Download className='w-4 h-4' />
          </ActionButton>
        </div>

        <CardContent className='absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold group-hover:text-blue-400 transition-colors mb-1'>
              {title}
            </h3>
            {/* Duration Badge for Videos */}
            {type === 'video' && duration && (
              <div className='flex justify-end mb-2'>
                <Badge variant='outline' className='bg-black/70 text-white'>
                  {duration}
                </Badge>
              </div>
            )}
          </div>
          <p className='text-sm text-white/80 mb-3'>{category}</p>
          <div className='flex flex-wrap gap-1 mb-3'>
            {tags.map((tag) => (
              <Badge key={tag} variant='default'>
                {tag}
              </Badge>
            ))}
          </div>

          <div className='flex items-center justify-between text-sm'>
            <span className='flex items-center gap-1'>
              <Heart className='w-3 h-3' />
              {likes}
            </span>
            <span className='flex items-center gap-1'>
              <Download className='w-3 h-3' />
              {downloads}
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
