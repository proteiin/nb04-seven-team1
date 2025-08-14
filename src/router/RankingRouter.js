import express from 'express';
import RankingController from '../controller/RankingController.js';

export default class RankingRouter {
    constructor() {
        this.router = express.Router({ mergeParams: true });
        this.rankingController = new RankingController();

        this.initializeRouter();
    }

    initializeRouter() {
        this.router.route('/')
            .get(this.rankingController.getRanking.bind(this.rankingController));
    }

    getRouter() {
        return this.router;
    }
}