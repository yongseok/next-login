import { withApiErrorHandler } from '@/lib/errors/apiHandlers';
import { NotFoundError } from '@/lib/errors/errors';
import { galleryService } from '@/lib/services/galleries.service';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withApiErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const gallery = await galleryService.getGalleryById(id);
  if (!gallery) {
    throw new NotFoundError('Gallery not found');
  }
  
  return NextResponse.json(gallery);
});

