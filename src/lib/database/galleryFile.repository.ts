import { Prisma, PrismaClient, GalleryFile } from '@prisma/client';
import { prisma } from './prisma';

class GalleryFileRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createGalleryFile(galleryFile: Prisma.GalleryFileCreateInput): Promise<GalleryFile> {
    return this.prisma.galleryFile.create({ data: galleryFile });
  }

  async getGalleryFileById(id: string): Promise<GalleryFile | null> {
    return this.prisma.galleryFile.findUnique({ where: { id } });
  }
  
}

export const galleryFileRepository = new GalleryFileRepository(prisma);