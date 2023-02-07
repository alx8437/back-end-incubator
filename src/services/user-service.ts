import * as bcrypt from 'bcrypt';
import { TUserDBType, userRepository } from '../repositories/user-repository';
import { ObjectId } from 'mongodb';
import { removeProperties } from '../utils';

export type User = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
};

export const userService = {
    async createUser(
        email: string,
        password: string,
        login: string,
    ): Promise<User | null> {
        const passwordSalt: string = await bcrypt.genSalt(10);
        const passwordHash = await this._getPasswordHash(
            password,
            passwordSalt,
        );

        const newUser: TUserDBType = {
            _id: new ObjectId(),
            id: Number(new Date()).toString(),
            login,
            email,
            createdAt: new Date().toISOString(),
            passwordHash,
            passwordSalt,
        };

        const result = await userRepository.createUser(newUser);

        if (result) {
            return removeProperties(newUser, [
                '_id',
                'passwordHash',
                'passwordSalt',
            ]) as User;
        } else {
            return null;
        }
    },
    async checkCredentials(
        loginOrEmail: string,
        password: string,
    ): Promise<User | null> {
        const user: TUserDBType | null =
            await userRepository.findUserByLoginOrMail(loginOrEmail);

        if (!user) {
            return null;
        }

        const hash = await this._getPasswordHash(password, user.passwordSalt);

        if (hash === user.passwordHash) {
            return user;
        }

        return null;
    },
    async _getPasswordHash(password: string, salt: string) {
        const hash: string = await bcrypt.hash(password, salt);
        return hash;
    },
};
