import { NextFunction, Request, Response } from 'express';
import { body, Result, validationResult } from 'express-validator';
import { getErrorMessage, TError } from './errors';
import { bloggersCollection } from '../repositories/db';
import { WithId } from 'mongodb';
import { Blogger } from '../repositories/bloggers-repository';
import { checkAuthorization } from './authorization';

export const errorMiddleWare = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors: Result = validationResult(req);

    const errorFields = errors
        .array({ onlyFirstError: true })
        .map((error) => error.param);
    const errorMessage: TError = getErrorMessage(errorFields);

    if (!errors.isEmpty()) {
        res.status(400).json(errorMessage);
        return;
    } else {
        next();
    }
};

export const titleValidateMiddleware = body('title')
    .trim()
    .isLength({ min: 1, max: 30 });

export const shortDescriptionValidateMiddleware = body('shortDescription')
    .trim()
    .isLength({ min: 1, max: 100 });

export const contentValidateMiddleware = body('content')
    .trim()
    .isLength({ min: 1, max: 1000 });

export const isCorrectBloggerIdMiddleware = body('bloggerId').custom(
    async (bloggerId) => {
        const currentBlogger: WithId<Blogger> | null =
            await bloggersCollection.findOne({ id: bloggerId });
        if (!currentBlogger) {
            throw new Error('BloggerId is not found');
        }

        return true;
    },
);

export const bloggerNameValidateMiddleware = body('name')
    .trim()
    .isLength({ min: 1, max: 15 });

export const youtubeUrlValidateMiddleware = body('youtubeUrl')
    .trim()
    .isURL()
    .isLength({ max: 100 });

export const authorizeMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { headers } = req;

    const isAuthorize = checkAuthorization(headers);
    if (!isAuthorize) {
        res.send(401);
        return;
    }

    next();
};
