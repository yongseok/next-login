'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Filter, Grid3X3, List, Search } from 'lucide-react';
import { useState } from 'react';
import MediaCard from './components/MediaCard';
import MediaList from './components/MediaList';
import LightboxModal from './components/LightboxModal';

const mediaItems = [
  {
    id: 1,
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
    type: 'video',
    title: 'City Timelapse',
    category: 'Urban',
    tags: ['city', 'timelapse', 'urban'],
    thumbnail: 'https://picsum.photos/1300/1500/?random=2',
    likes: 89,
    downloads: 23,
    duration: '2:34',
    width: 1300,
    height: 1500,
  },
  {
    id: 3,
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
    id: 4,
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
    id: 5,
    type: 'video',
    title: 'Coffee Shop',
    category: 'Lifestyle',
    tags: ['coffee', 'lifestyle', 'cozy'],
    thumbnail: 'https://picsum.photos/3200/1500/?random=5',
    likes: 78,
    downloads: 34,
    duration: '1:45',
    width: 3200,
    height: 1500,
  },
  {
    id: 6,
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
    id: 7,
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
    id: 8,
    type: 'video',
    title: 'Tech Animation',
    category: 'Technology',
    tags: ['tech', 'animation', 'futuristic'],
    thumbnail: 'https://picsum.photos/2600/3500/?random=8',
    likes: 234,
    downloads: 98,
    duration: '3:12',
    width: 1600,
    height: 1500,
  },
] as const;

export type MediaItem = (typeof mediaItems)[number];

const categories = [
  'All',
  'Nature',
  'Urban',
  'Art',
  'Lifestyle',
  'Design',
  'Technology',
];

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleLike = (id: number) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted p-4'>
      <div className='max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-primary mb-2'>
            Media Gallery
          </h1>
          <p className='text-muted-foreground'>
            Discover and explore our curated collected collection of images and
            videos
          </p>
        </div>

        {/* Search and Filters */}
        <div className='flex flex-col sm:flex-row gap-4 mb-8'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
            <Input
              type='text'
              placeholder='Search by title or tags'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 bg-background border-input focus:border-ring'
            />
          </div>

          <div className='flex gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Filter className='w-4 h-4 mr-2' />
                  {selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className='flex border rounded-lg '>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size='icon'
                className='rounded-r-none'
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className='w-4 h-4' />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size='icon'
                className='rounded-l-none'
                onClick={() => setViewMode('list')}
              >
                <List className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Tags */}
        <div className='flex flex-wrap gap-2 mb-8'>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className='cursor-pointer hover:bg-primary hover:text-primary-foreground'
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {viewMode === 'grid' ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {filteredItems.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                type={item.type as 'image' | 'video'}
                title={item.title}
                category={item.category}
                tags={item.tags}
                thumbnail={item.thumbnail}
                likes={item.likes}
                downloads={item.downloads}
                duration={item.duration}
                width={item.width}
                height={item.height}
                onClick={() => {
                  setCurrentId(item.id);
                  setIsModalOpen(true);
                }}
                toggleLike={toggleLike}
                likedItems={likedItems}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            {filteredItems.map((item) => (
              <MediaList
                key={item.id}
                id={item.id}
                type={item.type as 'image' | 'video'}
                title={item.title}
                category={item.category}
                tags={item.tags}
                thumbnail={item.thumbnail}
                likes={item.likes}
                downloads={item.downloads}
                duration={item.duration}
                width={item.width}
                height={item.height}
                toggleLike={toggleLike}
                likedItems={likedItems}
                onClick={() => {
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-slate-400 mb-4'>
              <Search className='w-12 h-12 mx-auto' />
            </div>
            <h3 className='text-lg font-semibold text-slate-600 mb-2'>
              No media found
            </h3>
            <p className='text-slate-500'>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
      <LightboxModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        filteredItems={filteredItems}
        toggleLike={toggleLike}
        currentId={currentId}
        likedItems={likedItems}
      />
    </div>
  );
}
