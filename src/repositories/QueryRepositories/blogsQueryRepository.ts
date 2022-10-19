import { Blog } from '../../services/blogs-service';
import { DeleteResult, WithId } from 'mongodb';
import { blogsCollection, postCollection } from '../db';
import { Query } from 'express-serve-static-core';
import { Post } from '../../services/posts-service';
import { getPageCount, getSkipCount } from '../../utils';

export type ParamsBlogPost = {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    searchNameTerm?: string;
};

export type QueryParamsTypes = Query & ParamsBlogPost;

export type GetItemsPayload<T> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: Array<T>;
    searchNameTerm?: string;
};

export const blogsQueryRepository = {
    async getAllBloggers(
        queryParams: QueryParamsTypes,
    ): Promise<GetItemsPayload<Blog>> {
        const { sortBy, pageNumber, pageSize, sortDirection, searchNameTerm } =
            queryParams;
        const skipCount = getSkipCount(pageNumber, pageSize);

        const filter = {
            name: { $regex: searchNameTerm ? searchNameTerm : '' },
        };

        const blogs: Blog[] =
            (await blogsCollection
                .find(filter, { projection: { _id: 0 } })
                .sort(sortBy, sortDirection)
                .skip(skipCount)
                .limit(pageSize)
                .toArray()) || [];

        const totalCount = await blogsCollection.countDocuments(filter);
        const pagesCount = getPageCount(totalCount, pageSize);

        const result: GetItemsPayload<Blog> = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs,
        };

        return result;
    },

    async getBloggerById(id: string): Promise<Promise<Blog> | null> {
        const blog: WithId<Blog> | null = await blogsCollection.findOne(
            { id },
            { projection: { _id: 0 } },
        );

        return blog;
    },

    async deleteBlogger(id: string): Promise<boolean> {
        const result: DeleteResult = await blogsCollection.deleteOne({ id });

        return result.deletedCount === 1;
    },

    async getPostsFromBlog(
        params: Query & ParamsBlogPost,
        blogId: string,
    ): Promise<GetItemsPayload<Post>> {
        const { sortBy, sortDirection, pageSize, pageNumber } = params;

        const skipCount = getSkipCount(pageNumber, pageSize);

        const posts: Post[] =
            (await postCollection
                .find({ blogId }, { projection: { _id: 0 } })
                .sort(sortBy, sortDirection)
                .skip(skipCount)
                .limit(pageSize)
                .toArray()) || [];

        const totalCount = posts.length;
        const pagesCount = getPageCount(totalCount, pageSize);

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
