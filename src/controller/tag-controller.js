import TagService from '../service/tag-service.js';

class TagController {
  async getTags(req, res, next) {
    try {
      const { page = 1, limit = 10, order = 'desc', search } = req.query;
      const tags = await TagService.getTags(
        parseInt(page, 10),
        parseInt(limit, 10),
        order,
        search,
      );

      if (tags.length === 0) {
        return res.status(404).json({ error: '조건에 맞는 태그가 없습니다.' });
      }

      res.status(200).json({ data: tags, total: tags.length });
    } catch (err) {
      next(err);
    }
  }

  async getTagId(req, res, next) {
    try {
      const tagId = parseInt(req.params.tagId, 10);

      const tag = await TagService.getTagId(tagId);

      if (!tag) {
        return res.status(404).json({ error: '태그를 찾을 수 없습니다.' });
      }
      res.status(200).json(tag);
    } catch (err) {
      next(err);
    }
  }
}

export default new TagController();
