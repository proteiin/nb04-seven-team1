import express from 'express';
import TagController from '../controller/tag-controller.js';
import { validateTagId } from '../middleware/validate.js';

const tagRouter = express.Router();

tagRouter.get('/', TagController.getTags);
tagRouter.get('/:tagId', validateTagId, TagController.getTagId);

export default tagRouter;
