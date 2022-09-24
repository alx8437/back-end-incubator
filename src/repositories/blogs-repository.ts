import { blogsCollection } from './db';
import { DeleteResult, InsertOneResult, UpdateResult, WithId } from 'mongodb';
import { Blog } from '../services/blogs-service';

export const blogsRepository = {
    async createBlogger(blog: Blog): Promise<boolean> {
        const result: InsertOneResult = await blogsCollection.insertOne(blog);

        return result.acknowledged;
    },

    async getAllBloggers(): Promise<Blog[]> {
        const blogs: WithId<Blog>[] = await blogsCollection
            .find({}, { projection: { _id: 0 } })
            .toArray();

        return blogs;
    },

    async getBloggerById(id: string): Promise<Promise<Blog> | null> {
        const blog: WithId<Blog> | null = await blogsCollection.findOne(
            { id },
            { projection: { _id: 0 } },
        );

        return blog;
    },

    async updateBlogger(
        id: string,
        name: string,
        youtubeUrl: string,
    ): Promise<boolean> {
        const result: UpdateResult = await blogsCollection.updateOne(
            { id },
            { $set: { name, youtubeUrl } },
        );

        return result.matchedCount === 1;
    },

    async deleteBlogger(id: string): Promise<boolean> {
        const result: DeleteResult = await blogsCollection.deleteOne({ id });

        return result.deletedCount === 1;
    },
};
