import { blogsRepository } from '../repositories/blogs-repository';
import { removeProperties } from '../utils';

export type Blog = {
    id: string;
    name: string;
    websiteUrl: string;
    createdAt: string;
    description: string;
};

export const blogsService = {
    async createBlogger(
        name: string,
        websiteUrl: string,
        description: string,
    ): Promise<Blog | null> {
        const newBlog: Blog = {
            id: Number(new Date()).toString(),
            name,
            websiteUrl,
            createdAt: new Date().toISOString(),
            description,
        };

        const isCreated = await blogsRepository.createBlogger(newBlog);

        const blogWithoutBaseId = removeProperties(newBlog, ['_id']) as Blog;

        return isCreated ? blogWithoutBaseId : null;
    },

    async updateBlogger(
        id: string,
        name: string,
        websiteUrl: string,
    ): Promise<boolean> {
        const result: boolean = await blogsRepository.updateBlogger(
            id,
            name,
            websiteUrl,
        );

        return result;
    },
};
