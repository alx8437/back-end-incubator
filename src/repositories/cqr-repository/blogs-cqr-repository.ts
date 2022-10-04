import { Blog } from '../../services/blogs-service';
import { DeleteResult, WithId } from 'mongodb';
import { blogsCollection } from '../db';

export const blogsCqrRepository = {
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

    async deleteBlogger(id: string): Promise<boolean> {
        const result: DeleteResult = await blogsCollection.deleteOne({ id });

        return result.deletedCount === 1;
    },
};
