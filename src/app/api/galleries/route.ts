import { auth } from '@/auth';
import { withApiErrorHandler } from '@/lib/errors/apiHandlers';
import { galleryService } from '@/lib/services/galleries.service';
import { gallerySchema } from '@/lib/validations/gallerySchema';
import { NextRequest, NextResponse } from 'next/server';

// api/galleries
/**
 * 1. formData 파싱
 * 2. 유효성 검사(zod)
 * 3. 파일 목록 파싱(try catch)
 * 4. 갤러리 생성
 * 5. 갤러리 반환
 */

export const POST = withApiErrorHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const strFileList = formData.get('fileList');

  let fileList: string[] = [];
  try {
    fileList = strFileList ? JSON.parse(strFileList as string) : [];
  } catch {
    throw new Error('파일 목록 형식이 올바르지 않습니다.');
  }

  // 유효성 검사
  const result = gallerySchema.parse({
    title,
    description,
    fileList,
  });

  const gallery = await galleryService.createGallery({
    title: result.title,
    description: result.description,
    author: {
      connect: {
        id: session.user.id,
      },
    },
    files: {
      connect: result.fileList.map((file) => ({ id: file.id })),
    },
  });

  return NextResponse.json(gallery, { status: 201 });
});
