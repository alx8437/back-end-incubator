import { Post } from '../../services/posts-service';
import { DeleteResult, WithId } from 'mongodb';
import { postCollection } from '../db';
import { postDBRepository } from '../posts-repository';

export const postQueryRepository = {
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

    async getPosts() {
        const posts: Post[] = await postDBRepository.getPosts();

        return posts;
    },
};
