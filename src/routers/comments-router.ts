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

export const commentsRouter = Router({});

commentsRouter.get(
    '/:id',
    bearerAuthMiddleware,
    errorMiddleWare,
    async (req: Request, res: Response) => {},
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
        } else {
            res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
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
        } else {
            res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
        }
    },
);
