import LikeRepository from '../repository/like-repository.js';

class LikeService {
  async addLike(groupId) {
    return await LikeRepository.updateLikeCount(groupId, 1);
  }

  async removeLike(groupId) {
    return await LikeRepository.updateLikeCount(groupId, -1);
  }
}

export default new LikeService();
