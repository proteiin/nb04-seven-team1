export class TagRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getTags = async (where, order, skip, take) => {
    return await this.prisma.tag.findMany({
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
  };
  tagsCount = async (where, order, skip, take) => {
    return await this.prisma.tag.count({
      where,
      orderBy: { created_at: order },
      skip,
      take,
    });
  };

  getTagId = async (where) => {
    return await this.prisma.tag.findUnique({
      where,
      select: {
        id: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });
  };
}
