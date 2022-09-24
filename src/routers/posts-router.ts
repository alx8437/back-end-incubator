import { Request, Response, Router } from 'express';
import {
    authorizeMiddleware,
    contentValidateMiddleware,
    errorMiddleWare,
    isCorrectBlogIdMiddleware,
    shortDescriptionValidateMiddleware,
    titleValidateMiddleware,
} from '../utils/middlewares';
import { Post, postsService } from '../services/posts-service';

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response) => {
    const posts: Post[] = await postsService.getPosts();
    res.send(posts);
});

postsRouter.post(
    '/',
    authorizeMiddleware,
    titleValidateMiddleware,
    shortDescriptionValidateMiddleware,
    contentValidateMiddleware,
    isCorrectBlogIdMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const { body } = req;
        const newPost: Post | null = await postsService.createPost(body);
        if (newPost) {
            res.status(201).send(newPost);
        } else {
            res.send(500);
        }
    },
);

postsRouter.put(
    '/:id',
    authorizeMiddleware,
    titleValidateMiddleware,
    shortDescriptionValidateMiddleware,
    contentValidateMiddleware,
    isCorrectBlogIdMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const isUpdated: boolean = await postsService.updatePost(
            req.params.id,
            req.body,
        );

        if (isUpdated) {
            res.send(204);
        } else {
            res.send(404);
        }
    },
);

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const postById: Post | null = await postsService.getPostById(req.params.id);

    if (postById) {
        res.send(postById);
    } else {
        res.send(404);
    }
});

postsRouter.delete(
    '/:id',
    authorizeMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted: boolean = await postsService.deletePostById(
            req.params.id,
        );

        if (isDeleted) {
            res.send(204);
        } else {
            res.send(404);
        }
    },
);
