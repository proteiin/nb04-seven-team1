import express from 'express';
import {
  groupParticipation,
  groupLeave,
} from '../controller/user-controller.js';

const router = express.Router();

router.route('/').post(groupParticipation).delete(groupLeave);

export default router;
