// import multer from 'multer';
import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mediaItems = [
  {
    id: 0,
    type: 'image',
    title: 'Mountain Landscape',
    category: 'Nature',
    tags: ['landscape', 'mountain', 'nature'],
    thumbnail: 'https://picsum.photos/2300/1500/?random=1',
    likes: 124,
    downloads: 45,
    width: 2300,
    height: 1500,
  },
  {
    id: 2,
    type: 'image',
    title: 'Abstract Art',
    category: 'Art',
    tags: ['abstract', 'colorful', 'art'],
    thumbnail: 'https://picsum.photos/3300/1500/?random=3',
    likes: 156,
    downloads: 67,
    width: 3300,
    height: 1500,
  },
  {
    id: 3,
    type: 'image',
    title: 'Ocean Waves',
    category: 'Nature',
    tags: ['ocean', 'waves', 'blue'],
    thumbnail: 'https://picsum.photos/2300/1500/?random=4',
    likes: 203,
    downloads: 89,
    width: 2300,
    height: 1500,
  },
  {
    id: 4,
    type: 'video',
    title: 'Coffee Shop',
    category: 'Lifestyle',
    tags: ['coffee', 'lifestyle', 'cozy'],
    thumbnail: 'https://picsum.photos/3200/1500/?random=5',
    likes: 78,
    downloads: 34,
    width: 3200,
    height: 1500,
    url: '/video/sample1.mp4',
    duration: '1:45',
  },
  {
    id: 5,
    type: 'image',
    title: 'Minimalist Design',
    category: 'Design',
    tags: ['minimal', 'clean', 'design'],
    thumbnail: 'https://picsum.photos/2900/1500/?random=6',
    likes: 145,
    downloads: 56,
    width: 2900,
    height: 1500,
  },
  {
    id: 6,
    type: 'image',
    title: 'Forest Path',
    category: 'Nature',
    tags: ['forest', 'path', 'green'],
    thumbnail: 'https://picsum.photos/3500/1500/?random=7',
    likes: 167,
    downloads: 72,
    width: 3400,
    height: 1500,
  },
  {
    id: 7,
    type: 'video',
    title: 'Tech Animation',
    category: 'Technology',
    tags: ['tech', 'animation', 'futuristic'],
    thumbnail: 'https://picsum.photos/2600/3500/?random=8',
    likes: 234,
    downloads: 98,
    width: 1600,
    height: 1500,
    url: '/video/sample2.mp4',
    duration: '3:12',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';

  const response = await fetch(
    `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return NextResponse.json(data);
}

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 } });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('typeof file', typeof file);
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 파일을 ArrayBuffer로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 저장 경로 설정 (예: public/uploads)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    // uploads 폴더가 없으면 생성 필요 (fs.mkdir)
    await writeFile(filepath, buffer);

    return NextResponse.json({
      message: 'File uploaded successfully',
      filename,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
