import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MediaItem } from '../page';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  Maximize2,
  Play,
  Share2,
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import ActionButton from './ActionButton';

export default function LightboxModal({
  isModalOpen,
  setIsModalOpen,
  filteredItems,
  toggleLike,
  currentId,
  likedItems,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  filteredItems: MediaItem[];
  toggleLike: (id: number) => void;
  currentId: number | null;
  likedItems: number[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (currentId) {
      setCurrentIndex(filteredItems.findIndex((item) => item.id === currentId));
    }
  }, [currentId]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      setCurrentIndex((index) =>
        index - 1 > 0 ? index - 1 : filteredItems.length - 1
      );
    } else if (event.key === 'ArrowRight') {
      setCurrentIndex((index) =>
        index + 1 < filteredItems.length ? index + 1 : 0
      );
    }
  };

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent
        className={` overflow-y-auto ${
          isFullScreen ? 'w-full h-full' : 'max-w-4xl max-h-full'
        }`}
      >
        <div className='mt-5'>
          {/* Media Content */}
          <div className='relative h-fit'>
            <Image
              src={
                filteredItems[currentIndex].thumbnail ||
                'https://picsum.photos/112312312sfsgfgsgsf123'
              }
              alt={filteredItems[currentIndex].title}
              width={1000}
              height={1000}
              className={`w-full object-contain rounded-lg`}
            />
            {/* full screen button */}
            <div className='absolute bottom-4 right-4'>
              <Button
                variant='outline'
                size='icon'
                className='hover:cursor-pointer opacity-70 hover:opacity-100 transition-opacity'
                onClick={handleFullScreen}
              >
                <Maximize2 className='w-4 h-4 ' />
              </Button>
            </div>
            {/* Navigation Buttons */}
            {filteredItems.length > 1 && (
              <div className='absolute flex justify-between w-full opacity-50 top-1/2 transform -translate-y-1/2 z-50 px-4'>
                <Button
                  className='w-10 h-10'
                  variant='ghost'
                  size='icon'
                  onClick={() =>
                    setCurrentIndex((index) =>
                      index - 1 > 0 ? index - 1 : filteredItems.length - 1
                    )
                  }
                >
                  <ChevronLeft className='w-8 h-8' />
                </Button>
                <Button
                  className='w-10 h-10'
                  variant='ghost'
                  size='icon'
                  onClick={() =>
                    setCurrentIndex((index) =>
                      index + 1 < filteredItems.length ? index + 1 : 0
                    )
                  }
                >
                  <ChevronRight className='w-8 h-8 text-primary' size={32} />
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className='absolute top-4 right-4 flex gap-2'>
              <ActionButton
                onClick={() => toggleLike(filteredItems[currentIndex].id)}
              >
                <Heart
                  className={`w-4 h-4 ${
                    likedItems.includes(filteredItems[currentIndex].id)
                      ? 'fill-red-500 text-red-500'
                      : ''
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
          {/* Image Info */}
          <div className={`mt-5 ${isFullScreen ? 'hidden' : ''}`}>
            <h2 className='text-lg font-bold text-primary'>
              {filteredItems[currentIndex].title}
            </h2>
            <p className='text-sm text-muted-foreground mb-2'>
              {filteredItems[currentIndex].category}
            </p>
            {/* Tags */}
            <div className='text-sm text-primary flex gap-2 mb-2'>
              {filteredItems[currentIndex].tags.map((tag) => {
                return <Badge key={tag}>{tag}</Badge>;
              })}
            </div>
            <div className='flex justify-between font-bold text-primary/80'>
              <div className='flex items-center gap-2'>
                <Heart className='w-4 h-4' />
                <p>{filteredItems[currentIndex].likes} likes</p>
              </div>
              <div className='flex items-center gap-2'>
                <Download className='w-4 h-4' />
                <p>{filteredItems[currentIndex].downloads} downloads</p>
              </div>
              {filteredItems[currentIndex].type === 'video' &&
                filteredItems[currentIndex].duration && (
                  <span className='flex items-center gap-2'>
                    <Play className='w-4 h-4' />
                    {filteredItems[currentIndex].duration}
                  </span>
                )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
