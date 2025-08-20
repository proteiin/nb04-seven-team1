import express from 'express';
import cors from 'cors';

// import GroupRouter from "./src/router/group-router.js";
import RankingRouter from './src/router/RankingRouter.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

function requestLogger(req, _, next) {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
}

app.use(requestLogger);

const rankingRouter = new RankingRouter();
// app.use('/groups', GroupRouter);
app.use('/groups/:groupId/rank', rankingRouter.getRouter());


app.listen(PORT, () => console.log(`Server started on port ${PORT}..`));