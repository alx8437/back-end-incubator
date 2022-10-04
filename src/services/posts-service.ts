import { postDBRepository } from '../repositories/posts-repository';
import { blogsService } from './blogs-service';
import { removeProperty } from '../utils';
import { blogsCqrRepository } from '../repositories/cqr-repository/blogs-cqr-repository';

export type Post = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};

export const postsService = {
    async createPost(body: {
        title: string;
        blogId: string;
        shortDescription: string;
        content: string;
    }): Promise<Post | null> {
        const { title, blogId, shortDescription, content } = body;
        const currentBlogger = await blogsCqrRepository.getBloggerById(blogId);

        const newPost: Post = {
            id: Number(new Date()).toString(),
            title,
            shortDescription,
            content,
            blogId,
            // this value has validated middleware isCorrectBloggerIdMiddleware()
            blogName: currentBlogger!.name,
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
};
