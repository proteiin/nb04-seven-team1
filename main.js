import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv'; // 환경변수를 위한 라이브러리

import container from './src/container.js';

import groupRouter from './src/router/group-router.js';
import rankingRouter from './src/router/ranking-router.js';
import userRouter from './src/router/user-router.js';
import imageRouter from './src/router/image-router.js';
import recordsRouter from './src/router/records-router.js';
import tagRouter from './src/router/tag-router.js';
import likeRouter from './src/router/like-router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

function requestLogger(req, _, next) {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
}
app.use(requestLogger);

// 컨테이너에서 필요에 따라 꺼내서 라우터에 전달합니다.
const { 
  userController, 
  userValidator, 
  tagController, 
  imageController,
  groupController,
  groupMiddleware,
  rankingController,
  likeController,
  recordsController
} = container;

app.use('/groups', groupRouter(groupController, groupMiddleware));
app.use('/groups/:groupId/rank', rankingRouter(rankingController));
app.use('/groups/:groupId/participants', userRouter(userController, userValidator));
app.use('/images', imageRouter(imageController));
app.use('/api', recordsRouter(recordsController));
app.use('/tags', tagRouter(tagController));
app.use('/groups/:groupId/likes', likeRouter(likeController));

// 이미지 파일 정적 제공
app.use('/uploads', express.static('uploads'));

// 전역 에러 핸들러 미들웨어
// 반드시 모든 라우터 뒤에 위치해야 합니다.
app.use((err, req, res, next) => {
  console.error(err); // 에러 로그

  const statusCode = err.statusCode || 500; // 에러 객체의 상태코드가 없으면 500을 기본값으로 사용
  const message = err.message || 'unexpected server error';
  const path = err.path || 'unknown';

  res.status(statusCode).json({
    path,
    message,
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}..`));
