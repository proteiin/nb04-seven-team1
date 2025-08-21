import express from 'express';
import tagRouter from './src/router/tag-router.js';

const app = express();
app.use(express.json());

app.use('/tags', tagRouter);

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});
