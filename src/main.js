import express from 'express';
// import likeRouter from './router/like-router.js';
import tagRouter from './router/tag-router.js';
// import { errorHandler } from './middleware/error-handler.js';

const app = express();
app.use(express.json());

// app.use('/groups', likeRouter);
app.use('/tags', tagRouter);

// app.use(errorHandler);

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});
