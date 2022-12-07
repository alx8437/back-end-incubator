import bcrypt from 'bcrypt';
import { TUserDBType, userRepository } from '../repositories/user-repository';
import { ObjectId } from 'mongodb';

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
            const { id, login, email, createdAt } = newUser;
            return { id, login, email, createdAt } as User;
        } else {
            return null;
        }
    },
    async _getPasswordHash(password: string, salt: string) {
        const hash: string = await bcrypt.hash(password, salt);
        return hash;
    },
};
