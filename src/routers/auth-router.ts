import { Router, Request, Response } from 'express';
import {
    errorMiddleWare,
    passwordValidateMiddleware,
} from '../utils/middlewares';
import { userService } from '../services/user-service';
import { HTTP_STATUS_CODES } from '../index';

export const authRouter = Router({});

type TAuthRequestBody = {
    loginOrEmail: string;
    password: string;
};

authRouter.post(
    '/login',
    //loginOrEmailValidateMiddleware,
    passwordValidateMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const { loginOrEmail, password } = req.body as TAuthRequestBody;
        const isAuth: boolean = await userService.checkCredentials(
            loginOrEmail,
            password,
        );
        if (isAuth) {
            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
        } else {
            res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        }
    },
);
