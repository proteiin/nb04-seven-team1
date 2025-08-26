export class LikeController {
  constructor(likeService) {
    this.likeService = likeService;
  }

  async addLike(req, res, next) {
    try {
      const { groupId } = req;

      const likecount = await this.likeService.addLike(groupId);
      res.status(200).json({ message: '좋아요 추가 완료', likecount });
    } catch (err) {
      next(err);
    }
  }

  async removeLike(req, res, next) {
    try {
      const { groupId } = req;

      const likecount = await this.likeService.removeLike(groupId);
      res.status(200).json({ message: '좋아요 취소 완료', likecount });
    } catch (err) {
      next(err);
    }
  }
}

/* class LikeController {
  async addLike(req, res, next) {
    try {
      const { groupId } = req;

      const likecount = await LikeService.addLike(groupId);
      res.status(200).json({ message: '좋아요 추가 완료', likecount });
    } catch (err) {
      next(err);
    }
  }

  async removeLike(req, res, next) {
    try {
      const { groupId } = req;

      const likecount = await LikeService.removeLike(groupId);
      res.status(200).json({ message: '좋아요 취소 완료', likecount });
    } catch (err) {
      next(err);
    }
  }
}

export default new LikeController(); */
