import { bloggersCollection } from './db';
import { DeleteResult, InsertOneResult, UpdateResult, WithId } from 'mongodb';

export type Blogger = {
    id: number;
    name: string;
    youtubeUrl: string;
};

export const bloggersRepository = {
    async createBlogger(blogger: Blogger): Promise<boolean> {
        const result: InsertOneResult = await bloggersCollection.insertOne(
            blogger,
        );

        return result.acknowledged;
    },

    async getAllBloggers(): Promise<Blogger[]> {
        const bloggers: WithId<Blogger>[] = await bloggersCollection
            .find({}, { projection: { _id: 0 } })
            .toArray();

        return bloggers;
    },

    async getBloggerById(id: number): Promise<Promise<Blogger> | null> {
        const blogger: WithId<Blogger> | null =
            await bloggersCollection.findOne(
                { id },
                { projection: { _id: 0 } },
            );

        return blogger;
    },

    async updateBlogger(
        id: number,
        name: string,
        youtubeUrl: string,
    ): Promise<boolean> {
        const result: UpdateResult = await bloggersCollection.updateOne(
            { id },
            { $set: { name, youtubeUrl } },
        );

        return result.matchedCount === 1;
    },

    async deleteBlogger(id: number): Promise<boolean> {
        const result: DeleteResult = await bloggersCollection.deleteOne({ id });

        return result.deletedCount === 1;
    },
};
