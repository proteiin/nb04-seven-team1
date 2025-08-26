import express from 'express';

const router = express.Router({ mergeParams: true });

export default (rankingController) => {
  router
    .route('/')
    .get(this.rankingController.getRanking.bind(this.rankingController));

  return router;
};

/* export default class RankingRouter {
  constructor() {
    this.router = express.Router({ mergeParams: true });
    this.rankingController = new RankingController();

    this.initializeRouter();
  }

  initializeRouter() {
    this.router
      .route('/')
      .get(this.rankingController.getRanking.bind(this.rankingController));
  }

  getRouter() {
    return this.router;
  }
} */