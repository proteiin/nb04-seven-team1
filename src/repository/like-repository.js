export class LikeRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async updateLikeCount(groupId, value) {
    return await this.prisma.group.update({
      where: { id: groupId },
      data: { like_count: { increment: value } },
      select: { id: true, like_count: true },
    });
  }
}

/* const prisma = new PrismaClient();

class LikeRepository {
  async updateLikeCount(groupId, value) {
    return await prisma.group.update({
      where: { id: groupId },
      data: { like_count: { increment: value } },
      select: { id: true, like_count: true },
    });
  }
}

export default new LikeRepository(); */