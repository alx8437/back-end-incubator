import { User } from './user-service';
import { commentDBRepository } from '../repositories/comment-repository';
import { removeProperties } from '../utils';

type TCommentatorInfo = {
    userId: string;
    userLogin: string;
};

export type TComment = {
    id: string;
    content: string;
    commentatorInfo: TCommentatorInfo;
    createdAt: string;
    postId?: string;
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
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: new Date().toISOString(),
            postId: postId,
        };

        const isAdded: boolean = await commentDBRepository.addCommentByPostId(
            postId,
            newComment,
        );

        if (isAdded) {
            return removeProperties(newComment, ['_id', 'postId']) as TComment;
        } else {
            return null;
        }
    },

    async putCommentById(id: string, content: string): Promise<boolean> {
        return await commentDBRepository.updateComment(id, content);
    },

    async deleteById(id: string): Promise<boolean> {
        return await commentDBRepository.deleteComment(id);
    },
};
