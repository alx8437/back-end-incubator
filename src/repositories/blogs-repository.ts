import { blogsCollection } from './db';
import { DeleteResult, InsertOneResult, UpdateResult, WithId } from 'mongodb';
import { Blog } from '../services/blogs-service';

export const blogsRepository = {
    async createBlogger(blog: Blog): Promise<boolean> {
        const result: InsertOneResult = await blogsCollection.insertOne(blog);

        return result.acknowledged;
    },

    async updateBlogger(
        id: string,
        name: string,
        websiteUrl: string,
    ): Promise<boolean> {
        const result: UpdateResult = await blogsCollection.updateOne(
            { id },
            { $set: { name, websiteUrl } },
        );

        return result.matchedCount === 1;
    },
};
