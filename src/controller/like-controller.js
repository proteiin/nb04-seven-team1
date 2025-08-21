import LikeService from '../service/like-service.js';

class LikeController {
  async addLike(req, res, next) {
    try {
      const groupId = parseInt(req.params.groupId, 10);

      const likecount = await LikeService.addLike(groupId);
      res.status(200).json({ message: '좋아요 추가 완료', likecount });
    } catch (err) {
      next(err);
    }
  }

  async removeLike(req, res, next) {
    try {
      const groupId = parseInt(req.params.groupId, 10);

      const likecount = await LikeService.removeLike(groupId);
      res.status(200).json({ message: '좋아요 취소 완료', likecount });
    } catch (err) {
      next(err);
    }
  }
}

export default new LikeController();
