import rankingRepository from '../repository/rankingRepository.js';

const getRanking = async ({ groupId, period, page, pageSize }) => {
    const result = await rankingRepository.getRanking({ groupId, period, page, pageSize });

    // 쿼리 결과에 순위 추가
    const ranking = result.map( (arr, idx) => ({
        // rank: idx + 1, 
        participantId: arr.user_id,
        nickname: arr.nickname,
        recordCount: arr._count.nickname,
        recordTime: arr._sum.time,
    }));

    return ranking;
};

export default {
    getRanking,
};