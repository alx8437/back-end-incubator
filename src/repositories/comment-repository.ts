import { TComment } from '../services/comments-service';
import { commentsCollection } from './db';

export const commentDBRepository = {
    async addCommentByPostId(
        postId: string,
        comment: TComment,
    ): Promise<boolean> {
        const result = await commentsCollection.insertOne(comment);

        return result.acknowledged;
    },
};
