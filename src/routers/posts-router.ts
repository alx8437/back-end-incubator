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
import { postQueryRepository } from '../repositories/QueryRepositories/postQueryRepository';
import { getQueryParams } from '../utils';
import {
    pageNumberSanitizer,
    pageSizeSanitizer,
    searchNameTermSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer,
} from '../utils/sanitizers';
import { GetItemsPayload } from '../repositories/types';

export const postsRouter = Router({});

postsRouter.get(
    '/',
    pageNumberSanitizer,
    pageSizeSanitizer,
    searchNameTermSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer,
    async (req: Request, res: Response) => {
        const { queryParams } = getQueryParams(req);

        const result: GetItemsPayload<Post> =
            await postQueryRepository.getPosts(queryParams);
        res.send(result);
    },
);

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
            res.sendStatus(500);
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
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    },
);

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const postById: Post | null = await postQueryRepository.getPostById(
        req.params.id,
    );

    if (postById) {
        res.send(postById);
    } else {
        res.sendStatus(404);
    }
});

postsRouter.delete(
    '/:id',
    authorizeMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted: boolean = await postQueryRepository.deletePostById(
            req.params.id,
        );

        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    },
);
