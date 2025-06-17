import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
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
import { GalleryProps } from '@/types/gallery';
import ReactPlayer from 'react-player';

const isYoutube = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export default function LightboxModal(props: GalleryProps) {
  const {
    filteredItems,
    currentId,
    likedItems,
    toggleLike,
    isModalOpen,
    setIsModalOpen,
    onCopyLink,
    onDownload,
  } = props;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (typeof currentId === 'number' && currentId >= 0) {
      setSelectedIndex(
        filteredItems.findIndex((item) => item.id === currentId)
      );
    }
  }, [filteredItems, currentId]);

  const selectedItem = filteredItems[selectedIndex >= 0 ? selectedIndex : 0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
  };
  const handlePrevious = () => {
    setSelectedIndex(
      (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
    );
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isFullScreen) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      handleNext();
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

  if (!selectedItem) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent
        className={`transition-all duration-500 ease-in-out overflow-y-auto ${
          isFullScreen
            ? 'bg-black/80 h-full w-full max-w-full p-0 border-0'
            : 'max-w-4xl max-h-full'
        }`}
      >
        {isFullScreen ? (
          <div
            className='w-full h-full flex justify-center items-center m-0 p-0'
            onClick={handleFullScreen}
          >
            {selectedItem.type === 'image' ? (
              <Image
                src={
                  selectedItem?.thumbnail ||
                  'https://picsum.photos/112312312sfsgfgsgsf123'
                }
                alt={selectedItem.title}
                width={1000}
                height={1000}
                className={`w-full object-contain rounded-lg z-50 transition-all duration-500 ease-in-out ${
                  isFullScreen
                    ? 'hover:cursor-zoom-out'
                    : 'hover:cursor-zoom-in'
                }`}
                onClick={handleFullScreen}
              />
            ) : (
              <div className='relative w-full h-full flex justify-center items-center m-0 p-0'>
                <div className='flex justify-center items-center w-fit h-fit m-0 p-0'>
                  <ReactPlayer
                    url={selectedItem.url}
                    width='100%'
                    height='100%'
                    controls={true}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='mt-5 flex flex-col items-center justify-center'>
            <VisuallyHidden>
              <DialogTitle>{selectedItem?.title || 'Image'}</DialogTitle>
            </VisuallyHidden>
            {/* Media Content Container */}
            <div className='flex justify-between items-center w-full'>
              {/* Previous Button */}
              <Button
                className={`w-10 h-full bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground hover:cursor-pointer opacity-70 hover:opacity-100 transition-opacity`}
                variant='default'
                size='icon'
                onClick={handlePrevious}
              >
                <ChevronLeft className='w-8 h-8' strokeWidth={4} />
              </Button>
              {/* Media Content */}
              <div className='relative h-fit w-full transition-all duration-500 ease-in-out'>
                {selectedItem.type === 'image' ? (
                  <Image
                    src={
                      selectedItem?.thumbnail ||
                      'https://picsum.photos/112312312sfsgfgsgsf123'
                    }
                    alt={selectedItem.title}
                    width={1000}
                    height={1000}
                    className={`w-full object-contain rounded-lg z-50 transition-all duration-500 ease-in-out ${
                      isFullScreen
                        ? 'hover:cursor-zoom-out'
                        : 'hover:cursor-zoom-in'
                    }`}
                    onClick={handleFullScreen}
                  />
                ) : (
                  <div className='relative w-full h-full flex justify-center items-center'>
                    <div className='flex justify-center items-center w-fit'>
                      <ReactPlayer
                        url={selectedItem.url}
                        width='100%'
                        height='100%'
                        controls={true}
                        className='w-full h-full'
                      />
                    </div>
                  </div>
                )}
                {/* full screen button */}
                <div
                  className={`absolute bottom-4 right-4 ${
                    selectedItem.type === 'video' ? 'hidden' : 'block'
                  }`}
                >
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
              </div>
              {/* Next Button */}
              <Button
                className={`w-10 h-full bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground hover:cursor-pointer opacity-70 hover:opacity-100 transition-opacity`}
                variant='default'
                size='icon'
                onClick={() => handleNext()}
              >
                <ChevronRight className='w-8 h-8' strokeWidth={4} />
              </Button>
            </div>
            {/* Action Buttons */}
            <div
              className={`flex gap-2 mt-4 ${
                isYoutube(selectedItem.url || '') ? 'hidden' : 'block'
              }`}
            >
              {/* Like Button */}
              <ActionButton
                onClick={() => toggleLike(selectedItem.id)}
                props={{
                  className: 'w-8 h-8 rounded-full',
                }}
              >
                <Heart
                  className={`w-4 h-4 ${
                    likedItems.includes(selectedItem.id)
                      ? 'fill-red-500 text-red-500'
                      : ''
                  }`}
                />
              </ActionButton>
              {/* Copy Link Button */}
              <ActionButton
                onClick={() => onCopyLink(selectedItem.thumbnail || '')}
                props={{
                  className: 'w-8 h-8 rounded-full',
                }}
              >
                <Share2 className='w-4 h-4' />
              </ActionButton>
              {/* Download Button */}
              <ActionButton
                onClick={() => onDownload(selectedItem.thumbnail || '')}
                props={{
                  className: 'w-8 h-8 rounded-full',
                }}
              >
                <Download className='w-4 h-4' />
              </ActionButton>
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
                {selectedItem.title}
              </h2>
              <p className='text-sm text-card-foreground/80 mb-2'>
                {selectedItem.category}
              </p>
              {/* Tags */}
              <div className='text-sm text-primary flex gap-2 mb-2'>
                {selectedItem.tags.map((tag) => {
                  return <Badge key={tag}>{tag}</Badge>;
                })}
              </div>
              <div className='flex justify-between font-bold text-primary/80 space-x-5'>
                <div className='flex items-center gap-2'>
                  <Heart className='w-4 h-4' />
                  <p>{selectedItem.likes} likes</p>
                </div>
                <div className='flex items-center gap-2'>
                  <Download className='w-4 h-4' />
                  <p>{selectedItem.downloads} downloads</p>
                </div>
                {selectedItem.type === 'video' && selectedItem.duration && (
                  <span className='flex items-center gap-2'>
                    <Play className='w-4 h-4' />
                    {selectedItem.duration}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
