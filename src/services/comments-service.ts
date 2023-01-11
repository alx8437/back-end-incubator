import { User } from './user-service';
import { commentDBRepository } from '../repositories/comment-repository';
import { removeProperties } from '../utils';

export type TComment = {
    id: string;
    content: string;
    userId: string;
    userLogin: string;
    createdAt: string;
};

export const commentsService = {
    async createComment(
        user: User,
        body: { content: string },
        postId: string,
    ): Promise<TComment | null> {
        const { content } = body;
        const newComment: TComment = {
            id: Number(new Date()).toString(),
            content: content,
            userId: user.id,
            userLogin: user.login,
            createdAt: new Date().toISOString(),
        };

        const isAdded: boolean = await commentDBRepository.addCommentByPostId(
            postId,
            newComment,
        );

        if (isAdded) {
            return removeProperties(newComment, ['_id']) as TComment;
        } else {
            return null;
        }
    },
};
