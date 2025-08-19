import RankingRepository from '../repository/RankingRepository.js';

export default class RankingService {
  constructor() {
    this.rankingRepository = new RankingRepository();
  }

  getRanking = async ({ groupId, duration, page, pageSize }) => {
    const result = await this.rankingRepository.getRanking({
      groupId,
      duration,
      page,
      pageSize,
    });

    // 쿼리 결과에 순위 추가
    const ranking = result.map((arr) => ({
      participantId: arr.user_id,
      nickname: arr.nickname,
      recordCount: arr._count.nickname,
      recordTime: arr._sum.time,
    }));

    return ranking;
  };
}
