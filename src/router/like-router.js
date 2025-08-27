import express from 'express';
import { GroupMiddleware } from '../middleware/group-middleware.js';

// export default likeRouter = express.Router({ mergeParams: true });

const router = express.Router({ mergeParams: true });
const groupMiddleware = new GroupMiddleware();

export default (likeController) => {
  router.route('/')
    .post(groupMiddleware.validateGroupId, likeController.addLike)
    .delete(groupMiddleware.validateGroupId, likeController.removeLike);

  return router;
}

/* likeRouter
  .route('/')
  .post(validateGroupId, LikeController.addLike)
  .delete(validateGroupId, LikeController.removeLike); */