import { Request, Response, Router } from 'express';
import {
    emailValidateMiddleware,
    errorMiddleWare,
    loginValidateMiddleware,
    passwordValidateMiddleware,
} from '../utils/middlewares';
import { userService } from '../services/user-service';

export const usersRouter = Router({});

usersRouter.post(
    '/',
    loginValidateMiddleware,
    passwordValidateMiddleware,
    emailValidateMiddleware,
    //should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const { email, password, login } = req.body;
        const user = await userService.createUser(email, password, login);

        if (user) {
            res.status(201).send(user);
        }
    },
);
