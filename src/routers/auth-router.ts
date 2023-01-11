import { Router, Request, Response } from 'express';
import {
    bearerAuthMiddleware,
    errorMiddleWare,
    passwordValidateMiddleware,
} from '../utils/middlewares';
import { User, userService } from '../services/user-service';
import { HTTP_STATUS_CODES } from '../index';
import { jwtService } from '../utils/jwt-service';

export const authRouter = Router({});

type TAuthRequestBody = {
    loginOrEmail: string;
    password: string;
};

authRouter.post(
    '/login',
    passwordValidateMiddleware,
    //loginValidateMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const { loginOrEmail, password } = req.body as TAuthRequestBody;
        const user: User | null = await userService.checkCredentials(
            loginOrEmail,
            password,
        );

        if (user) {
            const token: string = await jwtService.getJwtToken(user);
            const response = { accessToken: token };
            res.status(200).send(response);
        } else {
            res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        }
    },
);

authRouter.get('/me', bearerAuthMiddleware, (req: Request, res: Response) => {
    const { id, email, login } = req.user;
    const response = { id, email, login, createdAt: new Date().toISOString() };
    res.status(HTTP_STATUS_CODES.SUCCESS_200).send(response);
});
