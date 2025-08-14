import rankingService from '../service/rankingService.js';

/** 
 * rankingRouter.js를 위한 Controller
 * @returns {
 *   "rank": Number
 *   "nickname": string
 *   "count": Number
 *   "sumOfTime": Number
 * }
 */
const getRanking = async (req, res, next) => {
    const { groupId } = req.params;
    const { 
        period = 'month',
        page = 1,
        pageSize = 50,
    } = req.query;

    // Validate groupId
    if ( !groupId ) return res.status(400).json({ message: 'Invalid parameter "groupId"' }); // 글로벌 에러처리

    try {
        const ranking = await rankingService.getRanking({ 
            groupId: Number(groupId), 
            period,
            page: Number(page),
            pageSize: Number(pageSize),
        });

        res.status(200).json(ranking); 
    } catch (error) {
        // pass error variable to global errorHandler
        next(error);
    }
};

export default { 
    getRanking,
};