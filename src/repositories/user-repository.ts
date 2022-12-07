import { DeleteResult, ObjectId } from 'mongodb';
import { usersCollection } from './db';

export type TUserDBType = {
    _id: ObjectId;
    id: string;
    login: string;
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

    async deleteUserById(id: string): Promise<boolean> {
        const result: DeleteResult = await usersCollection.deleteOne({ id });

        return result.deletedCount === 1;
    },
};
