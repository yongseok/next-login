import { auth } from '@/auth';
import { withApiErrorHandler } from '@/lib/errors/apiHandlers';
import { NotFoundError } from '@/lib/errors/errors';
import { galleryService } from '@/lib/services/galleries.service';
import { gallerySchema } from '@/lib/validations/gallerySchema';
import type { ServerFile } from '@/types/gallery';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withApiErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const gallery = await galleryService.getGalleryById(id);
  if (!gallery) {
    throw new NotFoundError('Gallery not found');
  }
  
  const clientGallery = {
    id: gallery.id,
    title: gallery.title,
    description: gallery.description,
    files: gallery.files?.map((file): ServerFile => ({
      id: file.id,
      type: 'server',
      info: {
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
      },
      url: file.url,
    })) ?? [],
  };

  return NextResponse.json(clientGallery);
});

export const PATCH = withApiErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const strFileList = formData.get('fileList');

  const result = gallerySchema.parse({
    title,
    description,
    fileList: strFileList ? JSON.parse(strFileList as string) : [],
  });

  const gallery = await galleryService.updateGallery(id, {
    title: result.title,
    description: result.description,
    files: {
      set: result.fileList.map((file) => ({ id: file.id })),
    },
    author: {
      connect: {
        id: session.user.id,
      },
    },
  });

  return NextResponse.json(gallery);
});