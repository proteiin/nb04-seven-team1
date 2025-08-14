import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class RankingRepository {
    /**
     * 특정 그룹에 속한 참여자들의 기록을 특정 기간 내에서 기록시간 순으로 순위 매김
     * @param {number} groupId 그룹 ID
     * @param {string} period 정렬 방법(week, month: default)
     * @param {number} page 페이지네이션
     * @param {number} pageSize 요소 수
     */
    getRanking = async ({ groupId, period, page, pageSize }) => {
        let startDate, endDate = new Date();

        switch(period) {
            case 'week':
                // Set date before 7 days
                startDate = new Date();
                startDate.setDate(endDate.getDate() - 7);
                break;

            case 'month':
            default: 
                // Set date before 1 month
                startDate = new Date();
                startDate.setMonth(endDate.getMonth() - 1);
        }

        const result = await prisma.record.groupBy({
            by: ['nickname', 'user_id'],
            where: {
                // connect?
                group_id: groupId,
                createdAt: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            _count: { nickname: true, },
            _sum: { time: true, },
            orderBy: [
                { _sum: { time: 'desc' } },
                { _count: { nickname: 'desc' } },
            ],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return result;
    };
}