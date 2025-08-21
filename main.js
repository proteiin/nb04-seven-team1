import express from 'express';
import GroupRouter from "./src/router/group-router.js";
import cors from 'cors';
import * as dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


const prisma = new PrismaClient();
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});


function requestLogger(req, _, next) {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
}
app.use(requestLogger);


app.use(express.json());

app.use('/groups', GroupRouter);


app.use( (err, req, res, next) => {
  console.error(err); // 에러 로그

  const statusCode = err.statusCode || 500; // 에러 객체의 상태코드가 없으면 500을 기본값으로 사용
  const message = err.message || 'unexpected server error';
  const path = err.path || 'unknown';
  res.send(`{message:${message},  path: ${path}}`);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}..`));
