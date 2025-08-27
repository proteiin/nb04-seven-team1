import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LikeService {
  constructor(likeRepository, prisma) {
    this.likeRepository = likeRepository;
    this.prisma = prisma;
  }

  async addLike(groupId) {
    const { like_count } = await this.likeRepository.updateLikeCount(
      groupId,
      1,
    );

    if (like_count >= 100) {
      const badge = await prisma.badge.findFirst({
        where: {
          code: 'LIKE_100',
          group_id: groupId,
        },
      });

      if (!badge) {
        await prisma.badge.create({
          data: {
            code: 'LIKE_100',
            group_id: groupId,
          },
        });
      }
    }
  }

  async removeLike(groupId) {
    const { like_count } = await this.likeRepository.updateLikeCount(
      groupId,
      -1,
    );

    if (like_count < 100) {
      const badge = await prisma.badge.findFirst({
        where: {
          code: 'LIKE_100',
          group_id: groupId,
        },
      });

      if (badge) {
        await prisma.badge.delete({
          where: {
            code_group_id: {
              code: 'LIKE_100',
              group_id: groupId,
            },
          },
        });
      }
    }
  }
}

/* class LikeService {
  async addLike(groupId) {
    return await LikeRepository.updateLikeCount(groupId, 1);
  }

  async removeLike(groupId) {
    return await LikeRepository.updateLikeCount(groupId, -1);
  }
}

export default new LikeService(); */
