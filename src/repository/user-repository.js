export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // 닉네임 중복검사, 비밀번호 검사를 위한 유저 객체 반환
  findUser = async (where) => {
    return await this.prisma.user.findFirst({ where });
  };

  // 사용자 등록
  joinGroup = async (data, tx) => {
    const prismaClient = tx || this.prisma;
    return await prismaClient.user.create({ data });
  };

  // 사용자 그룹 탈퇴
  leaveGroup = async (where, tx) => {
    const prismaClient = tx || this.prisma;
    return await prismaClient.user.delete({ where });
  };

  // 그룹 인원 수 1 증가
  incrementGroupUser = async (groupId, tx) => {
    const prismaClient = tx || this.prisma;
    return await prismaClient.group.update({
      where: { id: groupId },
      data: { user_count: { increment: 1 } },
      include: {
        image: true,
        tags: true,
        // badge: true,
        user: {
          select: {
            id: true,
            nickname: true,
            created_at: true,
            updated_at: true,
            auth_code: true,
          },
        },
      },
    });
  };

  // 그룹 인원 수 1 감소
  decrementGroupUser = async (groupId, tx) => {
    const prismaClient = tx || this.prisma;
    return await prismaClient.group.update({
      where: { id: groupId },
      data: { user_count: { decrement: 1 } },
    });
  };

  // 유저의 운동 기록을 삭제
  deleteRecords = async (where, tx) => {
    const prismaClient = tx || this.prisma;
    return await prismaClient.record.deleteMany({ where });
  };
}
