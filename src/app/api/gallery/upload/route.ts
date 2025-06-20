import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    // const base64 = Buffer.from(buffer).toString('base64');
    // console.log('🚀 | POST | base64:', base64);

    // 저장 경로 설정 (예: public/uploads)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    // 파일 저장
    await writeFile(filepath, Buffer.from(buffer));
    return NextResponse.json({
      message: 'File uploaded successfully',
      filename,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error('🚀 | POST | error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
