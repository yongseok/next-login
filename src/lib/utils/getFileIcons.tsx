import React from 'react';
import { FileIcon, ImageIcon, Video, FileAudio, FileText } from 'lucide-react';

export const getFileIcon = (type: string) => {
  if (!type) return <FileIcon className='h-4 w-4' />;
  if (type.startsWith('image/')) return <ImageIcon className='h-4 w-4' />;
  if (type.startsWith('video/')) return <Video className='h-4 w-4' />;
  if (type.startsWith('audio/')) return <FileAudio className='h-4 w-4' />;
  if (type.startsWith('text') || type.includes('document'))
    return <FileText className='h-4 w-4' />;
  return <FileIcon className='h-4 w-4' />;
};
