import LikeRepository from '../repository/like-repository.js';

class LikeService {
  static async addLike(groupId) {
    return await LikeRepository.updateLikeCount(groupId, 1);
  }

  static async removeLike(groupId) {
    return await LikeRepository.updateLikeCount(groupId, -1);
  }
}

export default LikeService;
