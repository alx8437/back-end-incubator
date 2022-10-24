import { Post } from '../../services/posts-service';
import { DeleteResult, WithId } from 'mongodb';
import { postCollection } from '../db';
import { GetItemsPayload, QueryParamsTypes } from './blogsQueryRepository';
import { getPageCount, getSkipCount } from '../../utils';

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

    async getPosts(
        queryParams: QueryParamsTypes,
    ): Promise<GetItemsPayload<Post>> {
        const { sortBy, pageNumber, pageSize, sortDirection } = queryParams;

        const skipCount = getSkipCount(pageNumber, pageSize);
        const totalCount = await postCollection.countDocuments();
        const pagesCount = getPageCount(totalCount, pageSize);

        const posts: Post[] =
            (await postCollection
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
