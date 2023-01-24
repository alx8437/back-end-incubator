import { NextFunction, Request, Response } from 'express';
import { body, Result, validationResult } from 'express-validator';
import { getErrorMessage, TError } from './errors';
import {
    blogsCollection,
    commentsCollection,
    postsCollection,
} from '../repositories/db';
import { WithId } from 'mongodb';
import { checkBasicAuthorization } from './authorization';
import { Blog } from '../services/blogs-service';
import { Post } from '../services/posts-service';
import { HTTP_STATUS_CODES } from '../index';
import { jwtService } from './jwt-service';
import { userRepository } from '../repositories/user-repository';
import { TComment } from '../services/comments-service';

export const errorMiddleWare = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log('errorMiddleWare');
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

export const isCorrectPostIdMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const post: WithId<Post> | null = await postsCollection.findOne({
        id: req.params.id,
    });
    if (!post) {
        res.sendStatus(404);
    } else {
        next();
    }
};

export const isCorrectCommentIdMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log('isCorrectCommentIdMiddleware');
    const comment: WithId<TComment> | null = await commentsCollection.findOne({
        id: req.params.id,
    });
    if (!comment) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
    } else {
        next();
    }
};

export const isCorrectUserCommentMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log('isCorrectUserCommentMiddleware');
    const comment: WithId<TComment> | null = await commentsCollection.findOne({
        id: req.params.id,
    });

    if (req.user.id !== comment?.userId) {
        res.sendStatus(403);
    } else {
        next();
    }
};

export const blogNameValidateMiddleware = body('name')
    .trim()
    .isLength({ min: 1, max: 15 });

export const websiteUrlValidateMiddleware = body('websiteUrl')
    .trim()
    .isURL()
    .isLength({ max: 100 });

export const loginValidateMiddleware = body('login')
    .trim()
    .isLength({ min: 3, max: 10 });

export const passwordValidateMiddleware = body('password')
    .trim()
    .isLength({ min: 6, max: 20 });

export const emailValidateMiddleware = body('email').isEmail();

export const basicAuthorizeMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { headers } = req;

    const isAuthorize = checkBasicAuthorization(headers);
    if (!isAuthorize) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    next();
};

export const commentValidateMiddleware = body('content')
    .trim()
    .isLength({ min: 20, max: 300 });

export const bearerAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log(req.headers.authorization);
    if (!req.headers.authorization) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);

        return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const userId = jwtService.getUserIdByToken(token);
    console.log(userId);
    if (userId) {
        const user = await userRepository.findUserById(userId);
        if (user) {
            req.user = user;
            next();
            return;
        } else {
            res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        }
    }
    res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
};
