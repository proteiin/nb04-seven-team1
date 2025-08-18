import express from 'express'
import { PrismaClient } from '@prisma/client';
//import { PrismaClient } from "./generated/prisma/index.js";

import { RecordsRepository } from './src/repository/records.repository.js';
import { RecordsService } from './src/service/records.service.js';
import { RecordsController } from './src/controller/records.controller.js';

import recordsRouter from './src/router/records.router.js';

const app = express();
const PORT = 3000;

const prisma = new PrismaClient();
const recordsRepository = new RecordsRepository(prisma);
const recordsService = new RecordsService(recordsRepository);
const recordsController = new RecordsController(recordsService);

app.use(express.json());
app.use('/api', recordsRouter(recordsController));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || '인터넷 에러' });
});

app.listen(PORT, () => {
    console.log(`${PORT}에 서버를 시작합니다.`);
})

process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
