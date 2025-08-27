import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv'; // 환경변수를 위한 라이브러리

import container from './src/container.js';

import GroupRouter from './src/router/group-router.js';
import RankingRouter from './src/router/ranking-router.js';
import userRouter from './src/router/user-router.js'; // 라우터 함수를 가져와야 합니다.
import ImageRouter from './src/router/image-router.js';
import recordsRouter from './src/router/records-router.js';

// 컨테이너로 가져오시면 지워도 될 것 같습니다.
import { RecordsRepository } from './src/repository/records-repository.js';
import { RecordsService } from './src/service/records-service.js';
import { RecordsController } from './src/controller/records-controller.js';
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

// 역시 컨테이너를 사용하시면 컨테이너에서 조립을 하시면 될 것 같습니다.
const rankingRouter = new RankingRouter();
const imageRouter = new ImageRouter();
const recordsRepository = new RecordsRepository();
const recordsService = new RecordsService(recordsRepository);
const recordsController = new RecordsController(recordsService);

// 컨테이너에서 필요에 따라 꺼내서 라우터에 전달합니다.
const { userController, userValidator, tagController } = container;

app.use('/groups', GroupRouter);
app.use('/groups/:groupId/rank', rankingRouter.getRouter());
app.use(
  '/groups/:groupId/participants',
  userRouter(userController, userValidator),
);
app.use('/images', imageRouter.getRouter());
app.use('/', recordsRouter(recordsController));
app.use('/tags', tagRouter(tagController));
app.use('/groups/:groupId/likes', likeRouter);

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
