import express from 'express';
import GroupRouter from "./src/router/group-router.js";




const app = express();

app.use(express.json());

app.use('/groups', GroupRouter);


app.listen(3000, () => {
    'app is listen at http://localhost:3000'
})
