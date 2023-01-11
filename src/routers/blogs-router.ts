import { Request, Response, Router } from 'express';
import {
    basicAuthorizeMiddleware,
    blogNameValidateMiddleware,
    contentValidateMiddleware,
    errorMiddleWare,
    shortDescriptionValidateMiddleware,
    titleValidateMiddleware,
    websiteUrlValidateMiddleware,
} from '../utils/middlewares';
import { Blog, blogsService } from '../services/blogs-service';
import { Post, postsService } from '../services/posts-service';
import { getQueryParams } from '../utils';
import {
    pageNumberSanitizer,
    pageSizeSanitizer,
    searchNameTermSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer,
} from '../utils/sanitizers';
import { blogsQueryRepository } from '../repositories/QueryRepositories/blogsQueryRepository';
import { GetItemsPayload } from '../repositories/types';
import { blogsRepository } from '../repositories/blogs-repository';

export const blogsRouter = Router({});

blogsRouter.get(
    '/',
    pageNumberSanitizer,
    pageSizeSanitizer,
    searchNameTermSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer,
    async (req: Request, res: Response) => {
        const { queryParams } = getQueryParams(req);

        const result = await blogsQueryRepository.getAllBloggers(queryParams);
        res.status(200).send(result);
    },
);

// Post blog
blogsRouter.post(
    '/',
    basicAuthorizeMiddleware,
    blogNameValidateMiddleware,
    websiteUrlValidateMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const blog: Blog | null = await blogsService.createBlogger(
            req.body.name,
            req.body.websiteUrl,
            req.body.description,
        );

        if (blog) {
            res.status(201).send(blog);
        } else {
            return res.status(500);
        }
    },
);

// Post post
blogsRouter.post(
    '/:id/posts',
    basicAuthorizeMiddleware,
    titleValidateMiddleware,
    shortDescriptionValidateMiddleware,
    contentValidateMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const blogId = req.params.id;
        const blog: Blog | null = await blogsQueryRepository.getBloggerById(
            blogId,
        );
        if (blog) {
            const { body } = req;
            const newPost: Post | null = await postsService.createPost({
                ...body,
                blogId,
            });

            newPost ? res.status(201).send(newPost) : res.send(500);
        } else {
            res.sendStatus(404);
        }
    },
);

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog: Blog | null = await blogsQueryRepository.getBloggerById(
        req.params.id,
    );
    if (blog) {
        res.status(200).send(blog);
    } else {
        res.sendStatus(404);
    }
});

blogsRouter.get(
    '/:id/posts',
    pageNumberSanitizer,
    pageSizeSanitizer,
    searchNameTermSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer,
    async (req: Request, res: Response) => {
        const { queryParams, id } = getQueryParams(req);

        const validBlog: Blog | null =
            await blogsQueryRepository.getBloggerById(id);

        if (!validBlog) {
            res.sendStatus(404);
            return;
        }

        const result: GetItemsPayload<Post> =
            await blogsQueryRepository.getPostsFromBlog(queryParams, id);

        res.status(200).send(result);
    },
);

blogsRouter.put(
    '/:id',
    basicAuthorizeMiddleware,
    blogNameValidateMiddleware,
    websiteUrlValidateMiddleware,
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const isUpdate: boolean = await blogsService.updateBlogger(
            req.params.id,
            req.body.name,
            req.body.websiteUrl,
        );

        if (isUpdate) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    },
);

blogsRouter.delete(
    '/:id',
    basicAuthorizeMiddleware,
    // should be last
    errorMiddleWare,
    async (req, res) => {
        const { id } = getQueryParams(req);
        const isDeleted: boolean = await blogsRepository.deleteBlogger(id);
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    },
);
