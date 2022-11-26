import request from 'supertest';

import {
    GetItemsPayload,
    QueryParams,
} from '../../repositories/QueryRepositories/blogsQueryRepository';
import { Post } from '../../services/posts-service';
import { Blog } from '../../services/blogs-service';
import { app, HTTP_STATUS_CODES } from '../../index';
import { body } from 'express-validator';

const queryParams: QueryParams = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc',
};

const authorizationData = { Authorization: 'Basic YWRtaW46cXdlcnR5' };

const badInputModelField =
    'maxLengthMoreThen30symbols_Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the';

// Blogs
describe('Remove all data before run tests', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
    });

    // Create new blog for post
    it('Should create new Blog', async () => {
        const blogBody = {
            name: 'New blogger',
            description: 'I am the best man',
            websiteUrl: 'www.myWebsite.com',
        };

        const blogResponse = await request(app)
            .post('/blogs')
            .send(blogBody)
            .set(authorizationData)
            .expect(HTTP_STATUS_CODES.SUCCESS_CREATED_201);

        expect(blogResponse.body as Blog).toEqual({
            id: expect.any(String),
            name: blogBody.name,
            description: blogBody.description,
            websiteUrl: blogBody.websiteUrl,
            createdAt: expect.any(String),
        });
    });
});

// Posts
describe('Remove all data before run tests', () => {
    let blog: Blog;
    let post: Post;
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);

        // create blog for posts
        const blogBody = {
            name: 'New blog',
            description: 'The best blog',
            websiteUrl: 'www.myWebsite.com',
        };

        const blogResponse = await request(app)
            .post('/blogs')
            .send(blogBody)
            .set(authorizationData)
            .expect(HTTP_STATUS_CODES.SUCCESS_CREATED_201);

        expect(blogResponse.body as Blog).toEqual({
            id: expect.any(String),
            name: blogBody.name,
            description: blogBody.description,
            websiteUrl: blogBody.websiteUrl,
            createdAt: expect.any(String),
        });

        blog = blogResponse.body;
    });

    // Get all posts
    it('Should return 200', async () => {
        await request(app)
            .get('/posts')
            .query({ ...queryParams })
            .expect(HTTP_STATUS_CODES.SUCCESS_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: [],
            } as GetItemsPayload<Post>);
    });

    // Create new post
    it('Should create new post and returns the newly created post', async () => {
        const postBody = {
            title: 'new post',
            shortDescription: 'description',
            content: 'content',
            blogId: blog.id,
        };

        const postResponse = await request(app)
            .post('/posts')
            .send(postBody)
            .set(authorizationData)
            .expect(HTTP_STATUS_CODES.SUCCESS_CREATED_201);

        expect(postResponse.body as Post).toEqual({
            id: expect.any(String),
            title: postBody.title,
            shortDescription: postBody.shortDescription,
            content: postBody.content,
            blogId: expect.any(String),
            blogName: expect.any(String),
            createdAt: expect.any(String),
        });
        post = postResponse.body;
    });

    // Get post by id
    it('should be get post by post id', async () => {
        const getPostByIdResponse = await request(app)
            .get(`/posts/${post.id}`)
            .expect(HTTP_STATUS_CODES.SUCCESS_200);

        expect(getPostByIdResponse.body as Post).toEqual({
            id: expect.any(String),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: expect.any(String),
            blogName: expect.any(String),
            createdAt: expect.any(String),
        });
    });

    it('Put operations with post', async () => {
        type TPutInputModel = {
            title: string;
            shortDescription: string;
            content: string;
            blogId: string;
        };

        // if body invalid
        const badInputModelBody: TPutInputModel = {
            title: badInputModelField,
            shortDescription: 'shortDescription',
            content: 'content',
            blogId: blog.id,
        };

        await request(app)
            .put(`/posts/${post.id}`)
            .send(badInputModelBody)
            .set(authorizationData)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        // should be success
        const goodInputModelBody: TPutInputModel = {
            title: 'title',
            shortDescription: 'changed shortDescription',
            content: 'content',
            blogId: blog.id,
        };

        await request(app)
            .put(`/posts/${post.id}`)
            .send(goodInputModelBody)
            .set(authorizationData)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);

        // should be unauthorized error (without authorizationData)
        await request(app)
            .put(`/posts/${post.id}`)
            .send(goodInputModelBody)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    // Delete post
    // should be unauthorized error (without authorizationData)
    it('delete operation for post', async () => {
        await request(app)
            .delete(`/posts/${post.id}`)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

        // should get bad response if post id is fake
        await request(app)
            .delete('/posts/fakePostId')
            .set(authorizationData)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);

        // should get success remove post
        await request(app)
            .delete(`/posts/${post.id}`)
            .set(authorizationData)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
    });
});
