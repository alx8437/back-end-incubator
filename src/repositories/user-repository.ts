import { ObjectId } from 'mongodb';
import { usersCollection } from './db';

export type TUserDBType = {
    _id: ObjectId;
    id: string;
    loginOrEmail: string;
    email: string;
    createdAt: string;
    passwordHash: string;
    passwordSalt: string;
};

export const userRepository = {
    async createUser(user: TUserDBType): Promise<boolean> {
        const result = await usersCollection.insertOne(user);

        return result.acknowledged;
    },
};
