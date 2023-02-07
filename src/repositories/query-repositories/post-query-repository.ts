import { Post } from '../../services/posts-service';
import { DeleteResult, WithId } from 'mongodb';
import { postsCollection } from '../db';
import { getPageCount, getSkipCount } from '../../utils';
import { GetItemsPayload, TQueryParamsTypes } from '../types';

export const postQueryRepository = {
    async getPostById(id: string): Promise<Promise<Post> | null> {
        const post: WithId<Post> | null = await postsCollection.findOne(
            { id },
            { projection: { _id: 0 } },
        );

        return post;
    },

    async deletePostById(id: string): Promise<boolean> {
        const result: DeleteResult = await postsCollection.deleteOne({ id });

        return result.deletedCount === 1;
    },

    async getPosts(
        queryParams: TQueryParamsTypes,
    ): Promise<GetItemsPayload<Post>> {
        const { sortBy, pageNumber, pageSize, sortDirection } = queryParams;

        const skipCount = getSkipCount(pageNumber, pageSize);
        const totalCount = await postsCollection.countDocuments();
        const pagesCount = getPageCount(totalCount, pageSize);

        const posts: Post[] =
            (await postsCollection
                .find({}, { projection: { _id: 0 } })
                .sort(sortBy, sortDirection)
                .skip(skipCount)
                .limit(pageSize)
                .toArray()) || [];

        const result: GetItemsPayload<Post> = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts,
        };

        return result;
    },
};
