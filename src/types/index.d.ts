import { TUserDBType } from '../repositories/user-repository';

export {};

declare global {
    namespace Express {
        interface Request {
            user: TUserDBType;
        }
    }
}
