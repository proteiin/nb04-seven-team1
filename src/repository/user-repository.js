import prisma from '../utils/prisma/index.js';

export class UserRepository {
  // 닉네임 찾기
  findByNickname = async (nickname, groupId) => {
    const userNickname = await prisma.user.findFirst({
      where: {
        nickname,
        group_id: groupId,
      },
    });
    return userNickname;
  };

  // 사용자의 그룹 참여 시 그룹의 상세 정보 반환
  returnGroup = async (groupId) => {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            nickname: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });
    return group;
  };

  // 사용자의 그룹 등록
  joinGroup = async (nickname, password, groupId) => {
    const result = await prisma.$transaction(async (tx) => {
      (await tx.user.create({
        data: {
          group_id: groupId,
          nickname,
          password,
        },
      }),
        await tx.group.update({
          where: {
            id: groupId,
          },
          data: {
            user_count: {
              increment: 1,
            },
          },
        }));
    });
  };
}
