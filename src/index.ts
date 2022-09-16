import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { postsRouter } from './routers/posts-router';
import { bloggersRouter } from './routers/bloggers-router';
import { runDB } from './repositories/db';
import { testingRouter } from './routers/testing-router';

const app = express();
const corsMiddleware = cors();
const bodyParserMiddleware = bodyParser();

app.use(corsMiddleware);
app.use(bodyParserMiddleware);

const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send(`Example app listening on port ${port}!`);
});

// Routers
app.use('/posts', postsRouter);
app.use('/blogs', bloggersRouter);
app.use('/testing', testingRouter);

const startApp = async () => {
    await runDB();

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`);
    });
};

startApp();
