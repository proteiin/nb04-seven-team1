export class RecordsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  /**
   *운동 기록 생성
   * @param {number} userId - 사용자 ID
   * @param {number} groupId - 그룹 ID
   * @param {string} nickname - 닉네임
   * @param {string} exercise_type - 운동 종류
   * @param {string} description - 설명
   * @param {number} time - 운동 시간
   * @param {number} distance - 운동 거리
   * @param {string} password - 비밀번호
   */
  createRecord = async (dataToCreate) => {
    const record = await this.prisma.record.create({
      data: dataToCreate,
    });
    return {
      id: record.id,
      exerciseType: record.exercise_type,
      description: record.description,
      time: record.time,
      distance: record.distance,
      photos: record.images,
      author: {
        id: record.user_id,
        nickname: record.nickname,
      },
    };
  };

  /**
   * * 그룹 내 모든 운동 기록 조회
   * @param {number} groupId - 그룹 ID
   * @param {string} sortBy - 정렬 기준 ('latest' 또는 'time')
   * @param {string} search - 검색어 (닉네임)
   * @param {number} page - 페이지 번호
   * @param {number} pageSize - 페이지 당 항목 수
   */
  findAllRecords = async (data) => {
    const { groupId, orderBy, skip, take, search } = data;
    const records = await this.prisma.record.findMany({
      where: {
        group_id: groupId,
        nickname: { contains: search },
      },
      orderBy,
      skip,
      take,
    });
    return records;
  };

  /**
   * 특정 운동 기록 상세 조회
   * @param {number} recordId - 기록 ID
   */
  findRecordById = async (recordId) => {
    const record = await this.prisma.record.findUnique({
      where: { id: recordId },
    });
    return record;
  };
  /**
   * 운동 기록 수정
   * @param {number} recordId - 기록 ID
   * @param {string} password - 비밀번호
   * @param {object} data - 수정할 데이터
   */
  updateRecord = async (recordId, password, data) => {
    const record = await this.prisma.record.findUnique({
      where: { id: recordId },
    });

    if (!record || record.password !== password) {
      return null; // 기록이 없거나 비밀번호 다름
    }

    const updatedRecord = await this.prisma.record.update({
      where: { id: recordId },
      data: data,
    });
    return updatedRecord;
  };

  /**
   * 운동 기록 삭제
   * @param {number} recordId - 기록 ID
   * @param {string} password - 비밀번호
   */
  deleteRecord = async (recordId, password) => {
    const record = await this.prisma.record.findUnique({
      where: { id: recordId },
    });

    if (!record || record.password !== password) {
      return null;
    }

    await this.prisma.record.delete({
      where: { id: recordId },
    });
    return record;
  };

  /**
   * 모든 운동 기록 삭제 (그룹 탈퇴 시)
   * @param {number} userId - 사용자 ID
   * @param {number} groupId - 그룹 ID
   */
  deleteRecordsByUserId = async (userId, groupId) => {
    await this.prisma.record.deleteMany({
      where: {
        user_id: userId,
        group_id: groupId,
      },
    });
  };
  /** 그룹 내 닉네임으로 사용자 찾기
   *  @param {number} groupId - 그룹ID
   *  @param {string} nickname - 닉네임
   */
  findUserByNickname = async (groupId, nickname) => {
    const user = await this.prisma.user.findFirst({
      where: {
        group_id: groupId,
        nickname,
      },
    });
    return user;
  };

  /** 운동 기록 랭킹 조회 (주간/월간)
   *  @param {number} groupId - 그룹ID
   *  @param {string} period - 'weekly or monthly'
   *  @param {number} page - 페이지 번호
   *  @param {number} pageSize - 페이지 항목 수
   */
  findRecordsRanking = async (
    groupId,
    period = 'weekly',
    page = 1,
    pageSize = 10,
  ) => {
    const now = new Date();
    let startDate;

    if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      const dayOfWeek = now.getDay();
      startDate = new Date(now.setDate(now.getDate() - dayOfWeek));
      startDate.setHours(0, 0, 0, 0);
    }
    const ranking = await this.prisma.record.groupBy({
      by: ['nickname'],
      where: {
        group_id: groupId,
        created_at: { gte: startDate },
      },
      _count: { id: true },
      _sum: { time: true },
      orderBy: {
        _count: { id: 'desc' },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const formattedRankings = ranking.map((r) => ({
      nickname: r.nickname,
      recordCount: r._count.id,
      totalTime: r._sum.time,
    }));

    return formattedRankings;
  };
  createUser = async (dataToCreate) => {
    const newUser = await this.prisma.user.create({ data: dataToCreate });
    return newUser;
  };

  getTotalRecords = async (groupId) => {
    const total = await this.prisma.record.count({
      where: { group_id: groupId },
    });
    return total;
  };
}
