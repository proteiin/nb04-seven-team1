import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class TagRepository {
  async getTags(where, order, skip, take) {
    return await prisma.tag.findMany({
      where,
      orderBy: { created_at: order },
      skip,
      take,
      select: {
        id: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
  async tagsCount(where, order, skip, take) {
    return await prisma.tag.count({
      where,
      orderBy: { created_at: order },
      skip,
      take,
    });
  }

  async getTagId(where) {
    return await prisma.tag.findUnique({
      where,
      select: {
        id: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}

export default new TagRepository();
