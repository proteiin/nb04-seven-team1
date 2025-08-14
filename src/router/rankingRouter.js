import express from 'express';
import rankingController from '../controller/rankingController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(rankingController.getRanking);

export default router;