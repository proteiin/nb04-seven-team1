export class ImageRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  insertMetadata = async (files) => {
    return await this.prisma.image.createMany({
      data: files,
      skipDuplicates: true,
    });
  }
}