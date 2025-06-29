export const categories = [
  'All',
  'Nature',
  'Urban',
  'Art',
  'Lifestyle',
  'Design',
  'Technology',
] as const;

export type MediaItem = {
  id: number;
  type: 'image' | 'video';
  title: string;
  category: (typeof categories)[number];
  tags: string[];
  thumbnail: string;
  likes: number;
  downloads: number;
  width: number;
  height: number;
  url?: string;
  duration?: string;
};

export type GalleryProps = {
  filteredItems: MediaItem[];
  currentId: number | null;
  likedItems: number[];
  isModalOpen: boolean;
  toggleLike: (id: number) => void;
  onCopyLink: (url: string) => void;
  onDownload: (url: string) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
};

// upload page
// export interface FileWithPreview extends File {
//   id: string;
//   name: string;
//   size: number;
//   type: string;
//   preview?: string;
//   progress?: number;
//   status?: 'pending' | 'uploading' | 'success' | 'canceled' | 'error';
// }

// FIXME: FileWithPreview 타입 제거 필요
export type FileWithPreview = {
  file: File;
  id: string;
  preview?: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'canceled' | 'error';
};

export const TRANSFER_STATUS_ENUM = [
  'pending',
  'uploading',
  'success',
  'canceled',
  'error',
] as const;


/** 파일의 기본 메타데이터 **/
export type FileInfo = {
  filename: string;
  mimetype: string;
  size: number; // 파일 크기 (바이트)
};

/** 파일 전송 상태 **/
export type FileTransferInfo = {
  status: (typeof TRANSFER_STATUS_ENUM)[number];
  progress: number;
  errorMessage?: string;
};

export type LocalFile = {
  id: string;
  type: 'local';
  info: FileInfo;
  file: File; // <input>으로 선택한 로컬 파일 객체
  previewUrl?: string; // 미리보기 URL (예: 이미지)
  transfer: FileTransferInfo;
};

export type ServerFile = {
  id: string;
  type: 'server';
  info: FileInfo;
  url: string;
};

export type FileData = LocalFile | ServerFile;