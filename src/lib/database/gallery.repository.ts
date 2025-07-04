import { Prisma, PrismaClient, Gallery, GalleryFile } from '@prisma/client';
import { prisma } from './prisma';

export class GalleryRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createGallery(gallery: Prisma.GalleryCreateInput): Promise<Gallery> {
    return this.prisma.gallery.create({ data: gallery });
  }

  async getGalleryById(
    id: string
  ): Promise<Partial<Gallery & { files: Pick<GalleryFile, 'id' | 'url' | 'filename' | 'mimetype' | 'size'>[] }> | null> {
    return this.prisma.gallery.findUnique({
      where: { id },
      select: {
        title: true,
        description: true,
        updatedAt: true,
        files: {
          select: {
            id: true,
            url: true,
            filename: true,
            mimetype: true,
            size: true,
          },
        },
      },
    });
  }

  async getGalleryByUserId(userId: string): Promise<Gallery[]> {
    return this.prisma.gallery.findMany({ where: { authorId: userId } });
  }

  async updateGallery(
    id: string,
    gallery: Prisma.GalleryUpdateInput
  ): Promise<Gallery> {
    return this.prisma.gallery.update({ where: { id }, data: gallery });
  }

  async deleteGallery(id: string): Promise<void> {
    await this.prisma.gallery.delete({ where: { id } });
  }

  async getPagedGalleries(
    page: number,
    limit: number,
    orderBy: Prisma.GalleryOrderByWithRelationInput = { createdAt: 'desc' }
  ): Promise<{ data: Gallery[]; total: number }> {
    const [galleries, total] = await Promise.all([
      this.prisma.gallery.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      this.prisma.gallery.count(),
    ]);
    return { data: galleries, total };
  }

  async getAllGalleries(): Promise<Gallery[]> {
    return this.prisma.gallery.findMany();
  }
}

export const galleryRepository = new GalleryRepository(prisma);
