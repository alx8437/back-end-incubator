import { Router, Request, Response } from 'express';
import {
    bearerAuthMiddleware,
    commentValidateMiddleware,
    errorMiddleWare,
    isCorrectCommentIdMiddleware,
    isCorrectUserCommentMiddleware,
} from '../utils/middlewares';
import { commentsService } from '../services/comments-service';
import { HTTP_STATUS_CODES } from '../index';
import { commentsQueryRepository } from '../repositories/queryRepositories/commentsQueryRepository';

export const commentsRouter = Router({});

commentsRouter.get(
    '/:id',
    isCorrectCommentIdMiddleware,
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const comment = await commentsQueryRepository.getCommentById(
            req.params.id,
        );

        res.status(200).send(comment);
    },
);

commentsRouter.put(
    '/:id',
    // bearerAuthMiddleware put user for next middleware, should be first
    bearerAuthMiddleware,
    isCorrectCommentIdMiddleware,
    isCorrectUserCommentMiddleware,
    commentValidateMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res) => {
        const result: boolean = await commentsService.putCommentById(
            req.params.id,
            req.body.content,
        );

        if (result) {
            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
        }
    },
);

commentsRouter.delete(
    '/:id',
    bearerAuthMiddleware,
    isCorrectCommentIdMiddleware,
    isCorrectUserCommentMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const result: boolean = await commentsService.deleteById(req.params.id);
        if (result) {
            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
        }
    },
);
