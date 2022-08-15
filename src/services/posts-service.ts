import { Post } from '../routers/posts-router';
import { postDBRepository } from '../repositories/posts-repository';
import { bloggersService } from './bloggers-service';
import { removeProperty } from '../utils';

export const postsService = {
    async getPosts() {
        const posts: Post[] = await postDBRepository.getPosts();

        return posts;
    },

    async createPost(body: {
        title: string;
        bloggerId: number;
        shortDescription: string;
        content: string;
    }): Promise<Post | null> {
        const { title, bloggerId, shortDescription, content } = body;
        const currentBlogger = await bloggersService.getBloggerById(bloggerId);

        const newPost: Post = {
            id: Number(new Date()),
            title,
            shortDescription,
            content,
            bloggerId,
            // this value has validated middleware isCorrectBloggerIdMiddleware()
            bloggerName: currentBlogger!.name,
        };

        const isCreated: boolean = await postDBRepository.createPost(newPost);
        const postWithoutBaseId = removeProperty(newPost, '_id') as Post;

        return isCreated ? postWithoutBaseId : null;
    },

    async updatePost(
        id: number,
        body: {
            content: string;
            title: string;
            bloggerId: number;
            shortDescription: string;
        },
    ): Promise<boolean> {
        const { content, bloggerId, title, shortDescription } = body;
        const result: boolean = await postDBRepository.updatePost(
            id,
            content,
            title,
            bloggerId,
            shortDescription,
        );

        return result;
    },

    async getPostById(id: number): Promise<Promise<Post> | null> {
        const post: Post | null = await postDBRepository.getPostById(id);

        return post;
    },

    async deletePostById(id: number): Promise<boolean> {
        const result: boolean = await postDBRepository.deletePostById(id);

        return result;
    },
};
