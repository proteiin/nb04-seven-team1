import express from 'express';
import { userController } from '../controller/user-index.js';
import { userValidator } from '../middleware/user-index.js';

const router = express.Router();

router
  .route('/')
  .post(
    userValidator.validateNickname,
    userValidator.validatePassword,
    userValidator.checkDuplicateNickname,
    userController.groupParticipation,
  )
  .delete(
    userValidator.validateNickname,
    userValidator.validatePassword,
    userController.groupLeave,
  );

export default router;
