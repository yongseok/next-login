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
export interface FileWithPreview extends File {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'canceled' | 'error';
}