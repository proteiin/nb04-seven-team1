import express from 'express';
import {
  groupParticipation,
  groupleave,
} from '../controller/user-controller.js';

const router = express.Router();

router.route('/').post(groupParticipation).delete(groupleave);

export default router;
