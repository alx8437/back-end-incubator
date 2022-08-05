import { bloggersCollection } from './db';
import { DeleteResult, UpdateResult, WithId } from 'mongodb';

export type Blogger = {
    id: number;
    name: string;
    youtubeUrl: string;
};

export const bloggersDBRepository = {
    async createBlogger(name: string, youtubeUrl: string): Promise<Blogger> {
        const newBlogger = {
            id: Number(new Date()),
            name,
            youtubeUrl,
        };

        await bloggersCollection.insertOne(newBlogger);

        return newBlogger;
    },

    async getAllBloggers(): Promise<Blogger[]> {
        const bloggers: WithId<Blogger>[] = await bloggersCollection
            .find()
            .toArray();

        return bloggers;
    },

    async getBloggerById(id: number): Promise<Promise<Blogger> | null> {
        const blogger: WithId<Blogger> | null =
            await bloggersCollection.findOne({ id });

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
