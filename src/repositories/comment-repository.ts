import { TComment } from '../services/comments-service';
import { commentsCollection } from './db';
import { DeleteResult, UpdateResult } from 'mongodb';

export const commentDBRepository = {
    async addCommentByPostId(
        postId: string,
        comment: TComment,
    ): Promise<boolean> {
        const result = await commentsCollection.insertOne(comment);

        return result.acknowledged;
    },

    async updateComment(id: string, content: string): Promise<boolean> {
        const result: UpdateResult = await commentsCollection.updateOne(
            { id },
            { $set: { content } },
        );

        return result.matchedCount === 1;
    },

    async deleteComment(id: string): Promise<boolean> {
        const result: DeleteResult = await commentsCollection.deleteOne({ id });

        return result.acknowledged;
    },
};
