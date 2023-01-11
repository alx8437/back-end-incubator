import { Request, Response, Router } from 'express';
import {
    basicAuthorizeMiddleware,
    emailValidateMiddleware,
    errorMiddleWare,
    loginValidateMiddleware,
    passwordValidateMiddleware,
} from '../utils/middlewares';
import { userService } from '../services/user-service';
import {
    pageNumberSanitizer,
    pageSizeSanitizer,
    searchEmailTermSanitizer,
    searchLoginTermSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer,
} from '../utils/sanitizers';
import {
    TGetQueryUserPayload,
    userQueryRepository,
} from '../repositories/QueryRepositories/userQueryRepository';
import { getQueryParams } from '../utils';
import { userRepository } from '../repositories/user-repository';
import { HTTP_STATUS_CODES } from '../index';

export const usersRouter = Router({});

usersRouter.post(
    '/',
    basicAuthorizeMiddleware,
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

usersRouter.get(
    '/',
    basicAuthorizeMiddleware,
    pageNumberSanitizer,
    pageSizeSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer,
    searchLoginTermSanitizer,
    searchEmailTermSanitizer,
    async (req: Request, res: Response) => {
        const { queryParams } = getQueryParams(req);
        const body: TGetQueryUserPayload =
            await userQueryRepository.getAllUsers(queryParams);

        res.status(200).send(body);
    },
);

usersRouter.delete(
    '/:id',
    basicAuthorizeMiddleware,
    // should be last
    errorMiddleWare,
    async (req: Request, res: Response) => {
        const { id } = getQueryParams(req);

        const isDeleted: boolean = await userRepository.deleteUserById(id);

        if (isDeleted) {
            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
        } else {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        }
    },
);
