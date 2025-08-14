import express from 'express';
import {
  groupParticipation,
  groupLeave,
} from '../controller/user-controller.js';
import { UserRepository } from '../repository/user-repository.js';
import { UserValidator } from '../middleware/user-validation-middleware.js';

const router = express.Router();

const userRepository = new UserRepository();
const userValidator = new UserValidator(userRepository);

router
  .route('/')
  .post(
    userValidator.validateNickname,
    userValidator.validatePassword,
    userValidator.checkDuplicateNickname,
    groupParticipation,
  )
  .delete(
    userValidator.validateNickname,
    userValidator.validatePassword,
    groupLeave,
  );

export default router;
