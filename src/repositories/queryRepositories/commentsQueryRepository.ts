import { commentsCollection, postsCollection } from '../db';
import { getPageCount, getSkipCount } from '../../utils';
import { GetItemsPayload, TQueryParamsTypes } from '../types';
import { TComment } from '../../services/comments-service';
import { WithId } from 'mongodb';

export const commentsQueryRepository = {
    async getCommentsByPostId(
        postId: string,
        queryParams: TQueryParamsTypes,
    ): Promise<GetItemsPayload<TComment>> {
        const { pageNumber, pageSize, sortBy, sortDirection } = queryParams;

        const skipCount = getSkipCount(pageNumber, pageSize);
        const totalCount = await postsCollection.countDocuments();
        const pagesCount = getPageCount(totalCount, pageSize);

        const comments: TComment[] = await commentsCollection
            .find({ postId }, { projection: { _id: 0, postId: 0 } })
            .sort(sortBy, sortDirection)
            .skip(skipCount)
            .limit(pageSize)
            .toArray();

        return {
            pageSize,
            totalCount,
            page: pageNumber,
            items: comments,
            pagesCount,
        };
    },

    async getCommentById(commentId: string): Promise<TComment | null> {
        const comment: WithId<TComment> | null =
            await commentsCollection.findOne(
                { id: commentId },
                { projection: { _id: 0, postId: 0 } },
            );

        return comment;
    },
};
