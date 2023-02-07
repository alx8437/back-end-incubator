import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import { postsRouter } from './routers/posts-router';
import { blogsRouter } from './routers/blogs-router';
import { runDB } from './repositories/db';
// import { testingRouter } from './routers/testing-router';
// import { usersRouter } from './routers/users-router';
// import { authRouter } from './routers/auth-router';
// import { commentsRouter } from './routers/comments-router';

export const app = express();
const corsMiddleware = cors();

app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(bodyParser.json());
app.use(corsMiddleware);

const port = process.env.PORT || 5000;

export const HTTP_STATUS_CODES = {
    SUCCESS_200: 200,
    SUCCESS_CREATED_201: 201,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    NOT_FOUND_404: 404,
    NO_CONTENT_SUCCESS_204: 204,
    INTERNAL_SERVER_ERROR_500: 500,
    FORBIDDEN_403: 403,
};

app.get('/', (req: Request, res: Response) => {
    res.send(`Example app listening on port ${port}!`);
});

// Routers
// app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
// app.use('/testing', testingRouter);
// app.use('/users', usersRouter);
// app.use('/auth', authRouter);
// app.use('/comments', commentsRouter);

const startApp = async () => {
    await runDB();

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`);
    });
};

startApp();
