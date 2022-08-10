import { bloggersRepository } from '../repositories/bloggers-repository';

export type Blogger = {
    id: number;
    name: string;
    youtubeUrl: string;
};

export const bloggersService = {
    async createBlogger(
        name: string,
        youtubeUrl: string,
    ): Promise<Blogger | null> {
        const newBlogger = {
            id: Number(new Date()),
            name,
            youtubeUrl,
        };

        const isCreated = await bloggersRepository.createBlogger(newBlogger);

        return isCreated ? newBlogger : null;
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
