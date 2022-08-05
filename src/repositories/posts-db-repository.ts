import { DeleteResult, UpdateResult, WithId } from 'mongodb';
import { bloggersCollection, postCollection } from './db';
import { Post } from '../routers/posts-router';

export const postDBRepository = {
    async getPosts() {
        const posts: Post[] = await postCollection.find().toArray();

        return posts;
    },

    async createPost(
        title: string,
        bloggerId: number,
        shortDescription: string,
        content: string,
    ): Promise<Post> {
        const currentBlogger = await bloggersCollection.findOne({
            id: bloggerId,
        });

        const newPost: Post = {
            id: Number(new Date()),
            title,
            shortDescription,
            content,
            bloggerId,
            // this value has validated middleware isCorrectBloggerIdMiddleware()
            bloggerName: currentBlogger!.name,
        };

        await postCollection.insertOne(newPost);

        return newPost;
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
        const result: UpdateResult = await postCollection.updateOne(
            { id },
            { $set: { content, bloggerId, title, shortDescription } },
        );

        return result.matchedCount === 1;
    },

    async getPostById(id: number): Promise<Promise<Post> | null> {
        const post: WithId<Post> | null = await postCollection.findOne({ id });

        return post;
    },

    async deletePostById(id: number): Promise<boolean> {
        const result: DeleteResult = await postCollection.deleteOne({ id });

        return result.deletedCount === 1;
    },
};
