export class TagService {
  constructor(tagRepository) {
    this.tagRepository = tagRepository;
  }
  getTags = async (page, limit, order, search) => {
    const where = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    const skip = (page - 1) * limit;
    const take = limit;

    const totalCount = await this.tagRepository.tagsCount(
      where,
      order,
      skip,
      take,
    );

    if (totalCount === 0) {
      return { tags: [], totalCount: 0 };
    }

    const tags = await this.tagRepository.getTags(where, order, skip, take);

    return { tags, totalCount };
  };

  getTagId = async (tagId) => {
    const where = { id: tagId };

    return this.tagRepository.getTagId(where);
  };
}
