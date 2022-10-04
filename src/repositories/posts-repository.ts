import { DeleteResult, InsertOneResult, UpdateResult, WithId } from 'mongodb';
import { Post } from '../services/posts-service';
import { postCollection } from './db';

export const postDBRepository = {
    async getPosts() {
        const posts: Post[] = await postCollection
            .find({}, { projection: { _id: 0 } })
            .toArray();

        return posts;
    },

    async createPost(post: Post): Promise<boolean> {
        const result: InsertOneResult = await postCollection.insertOne(post);

        return result.acknowledged;
    },

    async updatePost(
        id: string,
        content: string,
        title: string,
        blogId: string,
        shortDescription: string,
    ): Promise<boolean> {
        const result: UpdateResult = await postCollection.updateOne(
            { id },
            { $set: { content, blogId, title, shortDescription } },
        );

        return result.matchedCount === 1;
    },
};
