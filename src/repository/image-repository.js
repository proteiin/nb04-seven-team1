import { PrismaClient } from "@prisma/client";

export default class ImageRepository {
  constructor() {
    this.prisma = new PrismaClient();
  }

  insertMetadata = async (files) => {
    return await this.prisma.image.createMany({
      data: files,
      skipDuplicates: true,
    });
  }
}