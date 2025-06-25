import { auth } from '@/auth';
import { galleryFileRepository } from '@/lib/database/galleryFile.repository';
import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileId = formData.get('id') as string;
    if (!fileId) {
      return NextResponse.json(
        { error: 'No file id uploaded' },
        { status: 400 }
      );
    }

    // 저장 경로 설정 (예: public/uploads)
    const uploadDir = path.join(process.env.UPLOAD_PATH!, 'files');
    await mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    // 🔑 파일 내용을 범용적인 ArrayBuffer(바이트 덩어리)로 읽어온다.
    const buffer = await file.arrayBuffer();
    // 🔑 이것을 Node.js 파일 쓰기용 **Buffer 객체로 변환**한다.
    const fileBuffer = Buffer.from(buffer);

    // 파일 저장
    await writeFile(filepath, fileBuffer);

    // 파일 다운로드 주소 생성
    const fileUrl = path.join(process.env.UPLOAD_URL!, 'files', filename);

    // 파일 정보를 데이터베이스에 저장
    await galleryFileRepository.createGalleryFile({
      id: fileId,
      url: fileUrl,
      filename,
      mimetype: file.type,
      size: file.size,
      uploader: {
        connect: {
          id: session.user.id,
        },
      },
    });

    return NextResponse.json({
      message: 'File uploaded successfully',
      filename,
      url: fileUrl,
    });
  } catch (error) {
    console.error('🚀 | POST | error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
