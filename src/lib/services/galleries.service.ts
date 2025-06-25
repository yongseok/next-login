import { Gallery, GalleryFile, Prisma } from '@prisma/client';
import { galleryRepository } from '../database/gallery.repository';

class GalleryService {
  constructor(private galleryRepo = galleryRepository) {}

  async createGallery(gallery: Prisma.GalleryCreateInput) {
    return this.galleryRepo.createGallery(gallery);
  }

  async getGalleryById(
    id: string
  ): Promise<Partial<
    Gallery & {
      files: Pick<GalleryFile, 'id' | 'url' | 'filename' | 'mimetype' | 'size'>[];
    }
  > | null> {
    return this.galleryRepo.getGalleryById(id);
  }

  async getGalleryByUserId(userId: string): Promise<Gallery[]> {
    return this.galleryRepo.getGalleryByUserId(userId);
  }

  async updateGallery(
    id: string,
    gallery: Prisma.GalleryUpdateInput
  ): Promise<Gallery> {
    return this.galleryRepo.updateGallery(id, gallery);
  }

  async deleteGallery(id: string): Promise<void> {
    return this.galleryRepo.deleteGallery(id);
  }

  async getPagedGalleries(
    page: number,
    limit: number,
    orderBy: Prisma.GalleryOrderByWithRelationInput
  ): Promise<Gallery[]> {
    return this.galleryRepo.getPagedGalleries(page, limit, orderBy);
  }

  async getAllGalleries(): Promise<Gallery[]> {
    return this.galleryRepo.getAllGalleries();
  }
}

export const galleryService = new GalleryService();