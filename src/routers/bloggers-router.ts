import { Request, Response, Router } from 'express';
import {
    Blogger,
    bloggersDBRepository,
} from '../repositories/bloggers-db-repository';
import {
    bloggerNameValidateMiddleware,
    errorMiddleWare,
    youtubeUrlValidateMiddleware,
} from '../utils/middlewares';

export const bloggersRouter = Router({});

bloggersRouter.get('/', async (req: Request, res: Response) => {
    const bloggers: Blogger[] = await bloggersDBRepository.getAllBloggers();
    res.send(bloggers);
});

bloggersRouter.post(
    '/',
    bloggerNameValidateMiddleware,
    youtubeUrlValidateMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const blogger: Blogger = await bloggersDBRepository.createBlogger(
            req.body.name,
            req.body.youtubeUrl,
        );
        res.status(201).send(blogger);
    },
);

bloggersRouter.get('/:id', async (req: Request, res: Response) => {
    const blogger: Blogger | null = await bloggersDBRepository.getBloggerById(
        Number(req.params.id),
    );
    if (blogger) {
        res.status(200).send(blogger);
    } else {
        res.send(404);
    }
});

bloggersRouter.put(
    '/:id',
    bloggerNameValidateMiddleware,
    youtubeUrlValidateMiddleware,
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const isUpdate: boolean = await bloggersDBRepository.updateBlogger(
            Number(req.params.id),
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

bloggersRouter.delete('/:id', async (req, res) => {
    const isDeleted: boolean = await bloggersDBRepository.deleteBlogger(
        Number(req.params.id),
    );
    if (isDeleted) {
        res.send(204);
    } else {
        res.send(404);
    }
});
