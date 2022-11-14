import { InsertOneResult, UpdateResult } from 'mongodb';
import { Post } from '../services/posts-service';
import { postsCollection } from './db';

export const postDBRepository = {
    async getPosts() {
        const posts: Post[] = await postsCollection
            .find({}, { projection: { _id: 0 } })
            .toArray();

        return posts;
    },

    async createPost(post: Post): Promise<boolean> {
        const result: InsertOneResult = await postsCollection.insertOne(post);

        return result.acknowledged;
    },

    async updatePost(
        id: string,
        content: string,
        title: string,
        blogId: string,
        shortDescription: string,
    ): Promise<boolean> {
        const result: UpdateResult = await postsCollection.updateOne(
            { id },
            { $set: { content, blogId, title, shortDescription } },
        );

        return result.matchedCount === 1;
    },
};
