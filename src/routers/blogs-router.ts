import { Request, Response, Router } from 'express';
import {
    authorizeMiddleware,
    blogNameValidateMiddleware,
    errorMiddleWare,
    youtubeUrlValidateMiddleware,
} from '../utils/middlewares';
import { Blog, blogsService } from '../services/blogs-service';
import { blogsCqrRepository } from '../repositories/cqr-repository/blogs-cqr-repository';

export const blogsRouter = Router({});

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs: Blog[] = await blogsCqrRepository.getAllBloggers();
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

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog: Blog | null = await blogsCqrRepository.getBloggerById(
        req.params.id,
    );
    if (blog) {
        res.status(200).send(blog);
    } else {
        res.send(404);
    }
});

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
    const isDeleted: boolean = await blogsCqrRepository.deleteBlogger(
        req.params.id,
    );
    if (isDeleted) {
        res.send(204);
    } else {
        res.send(404);
    }
});
