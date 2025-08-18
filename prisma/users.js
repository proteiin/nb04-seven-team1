// routes/users.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: '서버 에러'});
    }
});

app.listen(port, () => { 
    console.log(`Server started at port:  ${port}`);
})

//post 요청을 받아 게시글을 생성하는 API

app.post('/post', async (req, res) => {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
        return res.status(400).json({ error: '필수 항목 누락'});
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: Number(userId)}});
        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없음'});
        }
        const post = await prisma.post.create({
            data: {
                title,
                content,
                user: { connect: { id: Number(userId)}},
            },
        });

        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: '서버 에러'});    }
    }
);