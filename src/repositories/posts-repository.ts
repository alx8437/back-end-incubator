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
        bloggerId: string,
        shortDescription: string,
    ): Promise<boolean> {
        const result: UpdateResult = await postCollection.updateOne(
            { id },
            { $set: { content, bloggerId, title, shortDescription } },
        );

        return result.matchedCount === 1;
    },

    async getPostById(id: string): Promise<Promise<Post> | null> {
        const post: WithId<Post> | null = await postCollection.findOne(
            { id },
            { projection: { _id: 0 } },
        );

        return post;
    },

    async deletePostById(id: string): Promise<boolean> {
        const result: DeleteResult = await postCollection.deleteOne({ id });

        return result.deletedCount === 1;
    },
};
