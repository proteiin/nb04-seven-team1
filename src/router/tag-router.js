import express from 'express';

const router = express.Router();

export default (tagController) => {
  router.get('/', tagController.getTags);
  router.get('/:tagId', tagController.getTagId);

  return router;
};
