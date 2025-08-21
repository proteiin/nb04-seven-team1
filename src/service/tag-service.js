import TagRepository from '../repository/tag-repository.js';

class TagService {
  async getTags(page, limit, order, search) {
    const where = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    const totalCount = await TagRepository.tagsCount(where);

    if (totalCount === 0) {
      return { tags: [], totalCount: 0 };
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const tags = await TagRepository.getTags(where, order, skip, take);

    return { tags, totalCount };
  }

  async getTagId(tagId) {
    const where = { id: tagId };

    return TagRepository.getTagId(where);
  }
}

export default new TagService();
