import { Request, Response, Router } from 'express';
import {
    authorizeMiddleware,
    blogNameValidateMiddleware,
    contentValidateMiddleware,
    errorMiddleWare,
    shortDescriptionValidateMiddleware,
    titleValidateMiddleware,
    websiteUrlValidateMiddleware,
} from '../utils/middlewares';
import { Blog, blogsService } from '../services/blogs-service';
import {
    blogsQueryRepository,
    GetItemsPayload,
} from '../repositories/QueryRepositories/blogsQueryRepository';
import { Post, postsService } from '../services/posts-service';
import { query } from 'express-validator';
import { getQueryParams } from '../utils';

export const blogsRouter = Router({});

blogsRouter.get(
    '/',
    query('pageNumber').toInt().default(1),
    query('pageSize').toInt().default(10),
    query('searchNameTerm').default(''),
    query('sortBy').default('createdAt'),
    query('sortDirection').default('desc'),
    async (req: Request, res: Response) => {
        const { queryParams } = getQueryParams(req);

        const result = await blogsQueryRepository.getAllBloggers(queryParams);
        res.send(result);
    },
);

blogsRouter.post(
    '/',
    authorizeMiddleware,
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

blogsRouter.post(
    '/:id/posts',
    authorizeMiddleware,
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
            res.send(404);
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
        res.send(404);
    }
});

blogsRouter.get(
    '/:id/posts',
    query('pageNumber').toInt().default(1),
    query('pageSize').toInt().default(10),
    query('searchNameTerm').default(''),
    query('sortBy').default('createdAt'),
    query('sortDirection').default('desc'),
    async (req: Request, res: Response) => {
        const { queryParams, id } = getQueryParams(req);

        const validBlog: Blog | null =
            await blogsQueryRepository.getBloggerById(id);

        if (!validBlog) {
            res.send(404);
            return;
        }

        const result: GetItemsPayload<Post> =
            await blogsQueryRepository.getPostsFromBlog(queryParams, id);

        res.status(200).send(result);
    },
);

blogsRouter.put(
    '/:id',
    authorizeMiddleware,
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
            res.send(204);
        } else {
            res.send(404);
        }
    },
);

blogsRouter.delete('/:id', authorizeMiddleware, async (req, res) => {
    const isDeleted: boolean = await blogsQueryRepository.deleteBlogger(
        req.params.id,
    );
    if (isDeleted) {
        res.send(204);
    } else {
        res.send(404);
    }
});
