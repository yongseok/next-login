import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { MediaItem } from '../page';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  Maximize2,
  Minimize2,
  Play,
  Share2,
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import ActionButton from './ActionButton';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
        className={` transition-all duration-500 ease-in-out overflow-y-auto ${
          isFullScreen ? 'h-full w-full max-w-full' : 'max-w-4xl max-h-full'
        }`}
      >
        <div className='mt-5 flex flex-col  items-center'>
          <VisuallyHidden>
            <DialogTitle>
              {filteredItems[currentIndex]?.title || 'Image'}
            </DialogTitle>
          </VisuallyHidden>
          {/* Media Content */}
          <div className='relative h-fit w-full transition-all duration-500 ease-in-out'>
            <Image
              src={
                filteredItems[currentIndex].thumbnail ||
                'https://picsum.photos/112312312sfsgfgsgsf123'
              }
              alt={filteredItems[currentIndex].title}
              width={1000}
              height={1000}
              className={`w-full object-contain rounded-lg z-50 transition-all duration-500 ease-in-out ${
                isFullScreen ? 'hover:cursor-zoom-out' : 'hover:cursor-zoom-in'
              }`}
              onClick={handleFullScreen}
            />
            {/* full screen button */}
            <div className='absolute bottom-4 right-4'>
              <Button
                variant='ghost'
                size='icon'
                className='w-6 h-6 hover:bg-transparent'
                onClick={handleFullScreen}
              >
                {isFullScreen ? (
                  <Minimize2 color='white' />
                ) : (
                  <Maximize2 color='white' />
                )}
              </Button>
            </div>
            {/* Navigation Buttons */}
            {filteredItems.length > 1 && (
              <div className='absolute flex justify-between w-full top-1/2 transform -translate-y-1/2 z-0 px-4'>
                <Button
                  className='w-10 h-10 bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground hover:cursor-pointer opacity-70 hover:opacity-100 transition-opacity'
                  variant='default'
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
                  className='w-10 h-10 bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground hover:cursor-pointer opacity-70 hover:opacity-100 transition-opacity'
                  variant='default'
                  size='icon'
                  onClick={() =>
                    setCurrentIndex((index) =>
                      index + 1 < filteredItems.length ? index + 1 : 0
                    )
                  }
                >
                  <ChevronRight className='w-8 h-8' size={32} />
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
          <div
            className={`sticky bottom-0 mt-5 z-10
              bg-card/30 p-2 rounded-lg w-fit flex flex-col items-center justify-center
              transition-all duration-500 ease-in-out
              ${
                isFullScreen
                  ? 'hidden pointer-events-none'
                  : 'pointer-events-auto'
              }
            `}
          >
            <h2 className='text-lg font-bold text-card-foreground'>
              {filteredItems[currentIndex].title}
            </h2>
            <p className='text-sm text-card-foreground/80 mb-2'>
              {filteredItems[currentIndex].category}
            </p>
            {/* Tags */}
            <div className='text-sm text-primary flex gap-2 mb-2'>
              {filteredItems[currentIndex].tags.map((tag) => {
                return <Badge key={tag}>{tag}</Badge>;
              })}
            </div>
            <div className='flex justify-between font-bold text-primary/80 space-x-5'>
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
