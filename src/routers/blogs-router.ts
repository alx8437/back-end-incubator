import { Request, Response, Router } from 'express';
import {
    authorizeMiddleware,
    blogNameValidateMiddleware,
    contentValidateMiddleware,
    errorMiddleWare,
    shortDescriptionValidateMiddleware,
    titleValidateMiddleware,
    youtubeUrlValidateMiddleware,
} from '../utils/middlewares';
import { Blog, blogsService } from '../services/blogs-service';
import {
    blogsQueryRepository,
    GetPostsFromBlogPayload,
    ParamsBlogPost,
} from '../repositories/QueryRepositories/blogsQueryRepository';
import { Post, postsService } from '../services/posts-service';
import { query } from 'express-validator';
import { Query } from 'express-serve-static-core';

export const blogsRouter = Router({});

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs: Blog[] = await blogsQueryRepository.getAllBloggers();
    res.send(blogs);
});

blogsRouter.post(
    '/',
    authorizeMiddleware,
    blogNameValidateMiddleware,
    youtubeUrlValidateMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const blog: Blog | null = await blogsService.createBlogger(
            req.body.name,
            req.body.youtubeUrl,
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
    query('pageNumber').toInt(),
    query('pageSize').toInt(),
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const queryParams = req.query as Query & ParamsBlogPost;

        // const validBlog: Blog | null =
        //     await blogsQueryRepository.getBloggerById(id);
        //
        // if (!validBlog) {
        //     res.send(404);
        // }

        const result: GetPostsFromBlogPayload =
            await blogsQueryRepository.getPostsFromBlog(queryParams, id);

        res.status(200).send(result);
    },
);

blogsRouter.put(
    '/:id',
    authorizeMiddleware,
    blogNameValidateMiddleware,
    youtubeUrlValidateMiddleware,
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const isUpdate: boolean = await blogsService.updateBlogger(
            req.params.id,
            req.body.name,
            req.body.youtubeUrl,
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
