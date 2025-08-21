import TagService from '../service/tag-service.js';

class TagController {
  async getTags(req, res, next) {
    try {
      const { order = 'desc', search } = req.query;
      const page = parseInt(req.query.page || 1, 10);
      const limit = parseInt(req.query.limit || 10, 10);

      if (Number.isNaN(page) || page < 1 || Number.isNaN(limit) || limit < 1) {
        return res
          .status(400)
          .json({ error: '유효하지 않은 페이지 또는 리밋 값입니다.' });
      }

      const { tags, totalCount } = await TagService.getTags(
        page,
        limit,
        order,
        search,
      );

      res.status(200).json({ data: tags, total: totalCount });
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
