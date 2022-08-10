import { Request, Response, Router } from 'express';
import {
    Blogger,
    bloggersRepository,
} from '../repositories/bloggers-repository';
import {
    bloggerNameValidateMiddleware,
    errorMiddleWare,
    youtubeUrlValidateMiddleware,
} from '../utils/middlewares';
import { bloggersService } from '../services/bloggers-service';

export const bloggersRouter = Router({});

bloggersRouter.get('/', async (req: Request, res: Response) => {
    const bloggers: Blogger[] = await bloggersService.getAllBloggers();
    res.send(bloggers);
});

bloggersRouter.post(
    '/',
    bloggerNameValidateMiddleware,
    youtubeUrlValidateMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const blogger: Blogger | null = await bloggersService.createBlogger(
            req.body.name,
            req.body.youtubeUrl,
        );

        if (blogger) {
            res.status(201).send(blogger);
        } else {
            return res.status(500);
        }
    },
);

bloggersRouter.get('/:id', async (req: Request, res: Response) => {
    const blogger: Blogger | null = await bloggersService.getBloggerById(
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
        const isUpdate: boolean = await bloggersRepository.updateBlogger(
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
    const isDeleted: boolean = await bloggersService.deleteBlogger(
        Number(req.params.id),
    );
    if (isDeleted) {
        res.send(204);
    } else {
        res.send(404);
    }
});
