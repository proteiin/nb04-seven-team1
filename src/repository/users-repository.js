import prisma from '../utils/prisma/index.js';

export class UsersRepository {
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
}
