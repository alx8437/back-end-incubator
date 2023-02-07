import { Blog } from '../../services/blogs-service';
import { WithId } from 'mongodb';
import { blogsCollection, postsCollection } from '../db';
import { Query } from 'express-serve-static-core';
import { Post } from '../../services/posts-service';
import { getPageCount, getSkipCount } from '../../utils';
import { GetItemsPayload, TQueryParams, TQueryParamsTypes } from '../types';

export const blogsQueryRepository = {
    async getAllBloggers(
        queryParams: TQueryParamsTypes,
    ): Promise<GetItemsPayload<Blog>> {
        const { sortBy, pageNumber, pageSize, sortDirection, searchNameTerm } =
            queryParams;
        const skipCount = getSkipCount(pageNumber, pageSize);

        const regExp: RegExp = new RegExp(`${searchNameTerm}`, 'i');

        const filter = {
            name: { $regex: regExp },
        };

        const blogs: Blog[] = await blogsCollection
            .find(filter, { projection: { _id: 0 } })
            .sort(sortBy, sortDirection)
            .skip(skipCount)
            .limit(pageSize)
            .toArray();

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

    async getPostsFromBlog(
        params: Query & TQueryParams,
        blogId: string,
    ): Promise<GetItemsPayload<Post>> {
        const { sortBy, sortDirection, pageSize, pageNumber } = params;

        const skipCount = getSkipCount(pageNumber, pageSize);

        const posts: Post[] =
            (await postsCollection
                .find({ blogId }, { projection: { _id: 0 } })
                .sort(sortBy, sortDirection)
                .skip(skipCount)
                .limit(pageSize)
                .toArray()) || [];

        const totalCount = await postsCollection.countDocuments({ blogId });
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
