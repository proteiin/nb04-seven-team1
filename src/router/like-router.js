import express from 'express';
import { validateGroupId } from '../middleware';

// export default likeRouter = express.Router({ mergeParams: true });

const router = express.Router({ mergeParams: true });

export default (likeController) => {
  router.route('/')
    .post(validateGroupId, likeController.addLike)
    .delete(validateGroupId, likeController.removeLike);

  return router;
}

/* likeRouter
  .route('/')
  .post(validateGroupId, LikeController.addLike)
  .delete(validateGroupId, LikeController.removeLike); */