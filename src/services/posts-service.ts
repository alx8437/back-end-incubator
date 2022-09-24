import { postDBRepository } from '../repositories/posts-repository';
import { bloggersService } from './bloggers-service';
import { removeProperty } from '../utils';

export type Post = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    bloggerName: string;
    createdAt: string;
};

export const postsService = {
    async getPosts() {
        const posts: Post[] = await postDBRepository.getPosts();

        return posts;
    },

    async createPost(body: {
        title: string;
        blogId: string;
        shortDescription: string;
        content: string;
    }): Promise<Post | null> {
        const { title, blogId, shortDescription, content } = body;
        const currentBlogger = await bloggersService.getBloggerById(blogId);

        const newPost: Post = {
            id: Number(new Date()).toString(),
            title,
            shortDescription,
            content,
            blogId,
            // this value has validated middleware isCorrectBloggerIdMiddleware()
            bloggerName: currentBlogger!.name,
            createdAt: new Date().toISOString(),
        };

        const isCreated: boolean = await postDBRepository.createPost(newPost);
        const postWithoutBaseId = removeProperty(newPost, '_id') as Post;

        return isCreated ? postWithoutBaseId : null;
    },

    async updatePost(
        id: string,
        body: {
            content: string;
            title: string;
            blogId: string;
            shortDescription: string;
        },
    ): Promise<boolean> {
        const { content, blogId, title, shortDescription } = body;
        const result: boolean = await postDBRepository.updatePost(
            id,
            content,
            title,
            blogId,
            shortDescription,
        );

        return result;
    },

    async getPostById(id: string): Promise<Promise<Post> | null> {
        const post: Post | null = await postDBRepository.getPostById(id);

        return post;
    },

    async deletePostById(id: string): Promise<boolean> {
        const result: boolean = await postDBRepository.deletePostById(id);

        return result;
    },
};
