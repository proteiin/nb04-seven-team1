import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv'; // 환경변수를 위한 라이브러리

import GroupRouter from './src/router/group-router.js';
import RankingRouter from './src/router/RankingRouter.js';
import userRouter from './src/router/user-router.js';

dotenv.config();

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
app.use('/groups', GroupRouter);
app.use('/groups/:groupId/rank', rankingRouter.getRouter());
app.use('/groups/:groupId/participants', userRouter);

// 전역 에러 핸들러 미들웨어
// 반드시 모든 라우터 뒤에 위치해야 합니다.
app.use((err, req, res, next) => {
  console.error(err); // 에러 로그

  const statusCode = err.statusCode || 500; // 에러 객체의 상태코드가 없으면 500을 기본값으로 사용

  const message = err.message || 'unexpected server error';
  const path = err.path || 'unknown';

  res.status(statusCode).json({
    path: path,
    message: message,
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}..`));
