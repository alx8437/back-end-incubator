import { blogsRepository } from '../repositories/blogs-repository';
import { removeProperty } from '../utils';

export type Blog = {
    id: string;
    name: string;
    youtubeUrl: string;
    createdAt: string;
};

export const blogsService = {
    async createBlogger(
        name: string,
        youtubeUrl: string,
    ): Promise<Blog | null> {
        const newBlog: Blog = {
            id: Number(new Date()).toString(),
            name,
            youtubeUrl,
            createdAt: new Date().toISOString(),
        };

        const isCreated = await blogsRepository.createBlogger(newBlog);

        const blogWithoutBaseId = removeProperty(newBlog, '_id') as Blog;

        return isCreated ? blogWithoutBaseId : null;
    },

    async getAllBloggers(): Promise<Blog[]> {
        const blogs: Blog[] = await blogsRepository.getAllBloggers();

        return blogs;
    },

    async getBloggerById(id: string): Promise<Promise<Blog> | null> {
        const blog: Blog | null = await blogsRepository.getBloggerById(id);

        return blog;
    },

    async updateBlogger(
        id: string,
        name: string,
        youtubeUrl: string,
    ): Promise<boolean> {
        const result: boolean = await blogsRepository.updateBlogger(
            id,
            name,
            youtubeUrl,
        );

        return result;
    },

    async deleteBlogger(id: string): Promise<boolean> {
        const result: boolean = await blogsRepository.deleteBlogger(id);

        return result;
    },
};
