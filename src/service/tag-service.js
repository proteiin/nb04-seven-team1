import TagRepogitory from '../repository/tag-repository.js';

class TagService {
  async getTags(page, limit, order, search) {
    const where = {
      name: { contains: search, mode: 'insensitive' },
    };

    const skip = (page - 1) * limit;
    const take = limit;

    return await TagRepogitory.getTags(where, order, skip, take);
  }

  async getTagId(tagId) {
    const where = { id: tagId };

    return TagRepogitory.getTagId(where);
  }
}

export default new TagService();
