import express from 'express';
import cors from 'cors';

import rankingRouter from 'src/router/rankingRouter.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());


// 모든 Request에 대해 Method와 URL을 Console에 출력하는 미들웨어
function requestLogger(req, _, next) {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
}


app.use(requestLogger);
app.use('/groups/:groupId/rank', rankingRouter);


app.listen(PORT, () => console.log(`Server started on port ${PORT}..`));