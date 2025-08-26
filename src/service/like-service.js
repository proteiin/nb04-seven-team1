export class LikeService {
  constructor(likeRepository) {
    this.likeRepository = likeRepository;
  }

  async addLike(groupId) {
    return await this.likeRepository.updateLikeCount(groupId, 1);
  }

  async removeLike(groupId) {
    return await this.likeRepository.updateLikeCount(groupId, -1);
  }
}

/* class LikeService {
  async addLike(groupId) {
    return await LikeRepository.updateLikeCount(groupId, 1);
  }

  async removeLike(groupId) {
    return await LikeRepository.updateLikeCount(groupId, -1);
  }
}

export default new LikeService(); */
