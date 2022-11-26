import { Request, Response, Router } from 'express';
import {
    emailValidateMiddleware,
    errorMiddleWare,
    loginOrEmailValidateMiddleware,
    passwordValidateMiddleware,
} from '../utils/middlewares';
import { userService } from '../services/user-service';

export const usersRouter = Router({});

usersRouter.post(
    '/',
    loginOrEmailValidateMiddleware,
    passwordValidateMiddleware,
    emailValidateMiddleware,
    //should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const { email, password, loginOrEmail } = req.body;
        const user = await userService.createUser(
            email,
            password,
            loginOrEmail,
        );

        if (user) {
            res.status(201).send(user);
        }
    },
);
