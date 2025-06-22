import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  console.log('🚀 | POST | POST:', POST);
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 저장 경로 설정 (예: public/uploads)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    // 🔑 파일 내용을 범용적인 ArrayBuffer(바이트 덩어리)로 읽어온다.
    const buffer = await file.arrayBuffer();
    // 🔑 이것을 Node.js 파일 쓰기용 **Buffer 객체로 변환**한다.
    const fileBuffer = Buffer.from(buffer);

    // 파일 저장
    await writeFile(filepath, fileBuffer);
    return NextResponse.json({
      message: 'File uploaded successfully',
      filename,
      url: `${process.env.UPLOAD_PATH}/${filename}`,
    });
  } catch (error) {
    console.error('🚀 | POST | error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
