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
};

export type GetPostsFromBlogPayload = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: Array<Post>;
};

export const blogsQueryRepository = {
    async getAllBloggers(): Promise<Blog[]> {
        const blogs: WithId<Blog>[] = await blogsCollection
            .find({}, { projection: { _id: 0 } })
            .toArray();

        return blogs;
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
    ): Promise<GetPostsFromBlogPayload | null> {
        const { sortBy, sortDirection, pageSize, pageNumber } = params;

        const skipCount = getSkipCount(pageNumber, pageSize);

        const posts: Post[] = await postCollection
            .find({ blogId }, { projection: { _id: 0 } })
            .sort(sortBy, sortDirection)
            .skip(skipCount)
            .toArray();

        const totalCount = posts.length;
        const pagesCount = getPageCount(totalCount, pageSize);

        const result: GetPostsFromBlogPayload = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts,
        };

        return result;
    },
};
