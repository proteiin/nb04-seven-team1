import express from 'express';
import TagController from '../controller/tag-controller.js';

const tagRouter = express.Router();

tagRouter.get('/', TagController.getTags);
tagRouter.get('/:tagId', TagController.getTagId);

export default tagRouter;
