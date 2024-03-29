import { Router, Request, Response } from 'express';
import {
    bearerAuthMiddleware,
    errorMiddleWare,
    passwordValidateMiddleware,
} from '../utils/middlewares';
import { User, authService } from '../services/auth-service';
import { HTTP_STATUS_CODES } from '../index';
import { jwtService } from '../utils/jwt-service';

export const authRouter = Router({});

type TAuthRequestBody = {
    loginOrEmail: string;
    password: string;
};

// login
authRouter.post(
    '/login',
    passwordValidateMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const { loginOrEmail, password } = req.body as TAuthRequestBody;
        const user: User | null = await authService.checkCredentials(
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

// me auth
authRouter.get('/me', bearerAuthMiddleware, (req: Request, res: Response) => {
    const { id, email, login } = req.user;
    const response = { id, email, login, createdAt: new Date().toISOString() };
    res.status(HTTP_STATUS_CODES.SUCCESS_200).send(response);
});

// registration
authRouter.post('/registration', async (req: Request, res: Response) => {
    const { email, login, password } = req.body;
    const result = await authService.createUser(email, login, password);
    res.send(result);
});

// registration-email-resending
authRouter.post('/registration-email-resending');

// registration-confirmation
authRouter.post('/registration-confirmation');
