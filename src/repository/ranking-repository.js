export class RankingRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * 특정 그룹에 속한 참여자들의 기록을 특정 기간 내에서 기록시간 순으로 순위 매김
   * @param {number} groupId 그룹 ID
   * @param {string} duration 정렬 방법(week, month: default)
   * @param {number} page 페이지네이션
   * @param {number} pageSize 요소 수
   */
  getRanking = async ({ groupId, duration, page, pageSize }) => {
    let startDate;
    const endDate = new Date();

    switch (duration) {
      case 'weekly':
        // Set date before 7 days
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
        break;

      case 'monthly':
      default:
        // Set date before 1 month
        startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 1);
    }

    const result = await this.prisma.record.groupBy({
      by: ['nickname', 'user_id'],
      where: {
        // connect?
        group_id: groupId,
        created_at: {
          gte: startDate,
          lt: endDate,
        },
      },
      _count: { nickname: true },
      _sum: { time: true },
      orderBy: [{ _sum: { time: 'desc' } }, { _count: { nickname: 'desc' } }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return result;
  };
}
