import { Router, Request, Response } from 'express';
import { bearerAuthMiddleware } from '../utils/middlewares';

export const commentsRouter = Router({});

commentsRouter.get(
    '/:id',
    bearerAuthMiddleware,
    async (req: Request, res: Response) => {},
);

commentsRouter.put(
    '/:id',
    bearerAuthMiddleware,
    async (req: Request, res) => {},
);
