import { Request, Response, Router } from 'express';
import { postDBRepository } from '../repositories/posts-db-repository';
import {
    contentValidateMiddleware,
    errorMiddleWare,
    isCorrectBloggerIdMiddleware,
    shortDescriptionValidateMiddleware,
    titleValidateMiddleware,
} from '../utils/middlewares';

export type Post = {
    id: number;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: number;
    bloggerName: string;
};

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response) => {
    const posts: Post[] = await postDBRepository.getPosts();
    res.send(posts);
});

postsRouter.post(
    '/',
    titleValidateMiddleware,
    shortDescriptionValidateMiddleware,
    contentValidateMiddleware,
    isCorrectBloggerIdMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const { title, bloggerId, shortDescription, content } = req.body;
        const newPost: Post = await postDBRepository.createPost(
            title,
            bloggerId,
            shortDescription,
            content,
        );

        res.status(201).send(newPost);
    },
);

postsRouter.put(
    '/:id',
    titleValidateMiddleware,
    shortDescriptionValidateMiddleware,
    contentValidateMiddleware,
    isCorrectBloggerIdMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const isUpdated: boolean = await postDBRepository.updatePost(
            Number(req.params.id),
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
    const postById: Post | null = await postDBRepository.getPostById(
        Number(req.params.id),
    );

    if (postById) {
        res.send(postById);
    } else {
        res.send(404);
    }
});

postsRouter.delete('/:id', async (req: Request, res: Response) => {
    const isDeleted: boolean = await postDBRepository.deletePostById(
        Number(req.params.id),
    );

    if (isDeleted) {
        res.send(204);
    } else {
        res.send(404);
    }
});
