import { NextFunction, Request, Response } from 'express';
import { body, Result, validationResult } from 'express-validator';
import { getErrorMessage, TError } from './errors';
import { blogsCollection } from '../repositories/db';
import { WithId } from 'mongodb';
import { checkAuthorization } from './authorization';
import { Blog } from '../services/blogs-service';

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

export const isCorrectBlogIdMiddleware = body('blogId').custom(
    async (blogId) => {
        const currentBlogger: WithId<Blog> | null =
            await blogsCollection.findOne({ id: blogId });
        if (!currentBlogger) {
            throw new Error('BlogId is not found');
        }

        return true;
    },
);

export const blogNameValidateMiddleware = body('name')
    .trim()
    .isLength({ min: 1, max: 15 });

export const websiteUrlValidateMiddleware = body('websiteUrl')
    .trim()
    .isURL()
    .isLength({ max: 100 });

export const loginOrEmailValidateMiddleware = body('login')
    .trim()
    .isLength({ min: 3, max: 10 });

export const passwordValidateMiddleware = body('password')
    .trim()
    .isLength({ min: 6, max: 20 });

export const emailValidateMiddleware = body('email').isEmail();

export const authorizeMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { headers } = req;

    const isAuthorize = checkAuthorization(headers);
    if (!isAuthorize) {
        res.sendStatus(401);
        return;
    }

    next();
};
