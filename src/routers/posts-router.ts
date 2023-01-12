import { Request, Response, Router } from 'express';
import {
    basicAuthorizeMiddleware,
    bearerAuthMiddleware,
    commentValidateMiddleware,
    contentValidateMiddleware,
    errorMiddleWare,
    isCorrectBlogIdMiddleware,
    isCorrectPostIdMiddleware,
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
import { commentsQueryRepository } from '../repositories/QueryRepositories/commentsQueryRepository';
import { commentsService, TComment } from '../services/comments-service';
import { HTTP_STATUS_CODES } from '../index';

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

// Get comments
postsRouter.get(
    '/:id/comments',
    pageNumberSanitizer,
    pageSizeSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer,
    isCorrectPostIdMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const comments = commentsQueryRepository.getCommentsByPostId(
            req.params.id,
        );
    },
);

// Post post
postsRouter.post(
    '/',
    basicAuthorizeMiddleware,
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

// Post comment
postsRouter.post(
    '/:id/comments',
    isCorrectPostIdMiddleware,
    bearerAuthMiddleware,
    commentValidateMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const { id } = getQueryParams(req);
        const comment: TComment | null = await commentsService.createComment(
            req.user,
            req.body,
            id,
        );
        if (comment) {
            res.status(HTTP_STATUS_CODES.SUCCESS_CREATED_201).send(comment);
        }
    },
);

// Put post
postsRouter.put(
    '/:id',
    basicAuthorizeMiddleware,
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

// Get post by id
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

// Delete post by Id
postsRouter.delete(
    '/:id',
    basicAuthorizeMiddleware,
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
