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
  participationInTheGroup = async (groupId) => {
    const participation = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    return participation;
  };
}
