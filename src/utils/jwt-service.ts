import { User } from '../services/user-service';
import jwt from 'jsonwebtoken';

type TTokenPayload = {
    userId: string;
    iat: number;
    exp: number;
};

const SECRET_PHRASE = 'secret!#';

export const jwtService = {
    async getJwtToken(user: User): Promise<string> {
        return await jwt.sign({ userId: user.id }, SECRET_PHRASE);
    },

    getUserIdByToken(token: string) {
        try {
            const result = jwt.verify(token, SECRET_PHRASE) as TTokenPayload;
            return result.userId;
        } catch (e) {
            return null;
        }
    },
};
