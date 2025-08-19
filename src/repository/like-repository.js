import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class LikeRepository {
  async updateLikeCount(groupId, value) {
    return await prisma.group.update({
      where: { id: groupId },
      data: { like_count: { increment: value } },
      select: { id: true, like_count: true },
    });
  }
}

export default new LikeRepository();
