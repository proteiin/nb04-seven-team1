import RankingService from '../service/RankingService.js';

export default class RankingController {
  constructor() {
    this.rankingService = new RankingService();
  }

  /**
   * rankingRouter.js를 위한 Controller
   * @returns {
   *   "rank": Number
   *   "nickname": string
   *   "count": Number
   *   "sumOfTime": Number
   * }
   */
  getRanking = async (req, res, next) => {
    const { groupId } = req.params;
    const { duration = 'monthly', page = 1, pageSize = 50 } = req.query;

    // Validate groupId
    if (!groupId || isNaN(parseInt(groupId)))
      return res.status(400).json({ message: 'groupId must be integer' });

    try {
      const ranking = await this.rankingService.getRanking({
        groupId: parseInt(groupId),
        duration,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });

      res.status(200).json(ranking);
    } catch (error) {
      next(error);
    }
  };
}
