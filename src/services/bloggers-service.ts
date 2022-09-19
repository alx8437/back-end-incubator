import { bloggersRepository } from '../repositories/bloggers-repository';
import { removeProperty } from '../utils';

export type Blogger = {
    id: string;
    name: string;
    youtubeUrl: string;
    createdAt: string;
};

export const bloggersService = {
    async createBlogger(
        name: string,
        youtubeUrl: string,
    ): Promise<Blogger | null> {
        const newBlogger: Blogger = {
            id: Number(new Date()).toString(),
            name,
            youtubeUrl,
            createdAt: new Date().toISOString(),
        };

        const isCreated = await bloggersRepository.createBlogger(newBlogger);

        const bloggerWithoutBaseId = removeProperty(
            newBlogger,
            '_id',
        ) as Blogger;

        return isCreated ? bloggerWithoutBaseId : null;
    },

    async getAllBloggers(): Promise<Blogger[]> {
        const bloggers: Blogger[] = await bloggersRepository.getAllBloggers();

        return bloggers;
    },

    async getBloggerById(id: number): Promise<Promise<Blogger> | null> {
        const blogger: Blogger | null = await bloggersRepository.getBloggerById(
            id,
        );

        return blogger;
    },

    async updateBlogger(
        id: number,
        name: string,
        youtubeUrl: string,
    ): Promise<boolean> {
        const result: boolean = await bloggersRepository.updateBlogger(
            id,
            name,
            youtubeUrl,
        );

        return result;
    },

    async deleteBlogger(id: number): Promise<boolean> {
        const result: boolean = await bloggersRepository.deleteBlogger(id);

        return result;
    },
};
