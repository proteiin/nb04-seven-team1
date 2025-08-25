import express from 'express';
import LikeController from '../controller/like-controller.js';
import { validateGroupId } from '../middleware/validate.js';

const likeRouter = express.Router({ mergeParams: true });

likeRouter
  .route('/')
  .post(validateGroupId, LikeController.addLike)
  .delete(validateGroupId, LikeController.removeLike);

export default likeRouter;
