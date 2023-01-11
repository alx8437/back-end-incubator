import request from 'supertest';
import { Post } from '../../services/posts-service';
import { Blog } from '../../services/blogs-service';
import { app, HTTP_STATUS_CODES } from '../../index';
import { User } from '../../services/user-service';
import { GetItemsPayload, TQueryParams } from '../../repositories/types';

const queryParams: TQueryParams = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc',
};

const AUTHORIZATION_DATA = { Authorization: 'Basic YWRtaW46cXdlcnR5' };

const USER_BODY = {
    login: 'login',
    password: 'qwerty',
    email: 'email@email.com',
};

const badInputModelField =
    'maxLengthMoreThen30symbols_Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the';

// const sleep = (ms: number) => {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// };

// Blogs
describe('Blogs API', () => {
    let blog: Blog;
    let post: Post;

    // Clear all data
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
    });

    // Create new blog
    it('Should create new Blog', async () => {
        const blogBody = {
            name: 'New blogger',
            description: 'I am the best man',
            websiteUrl: 'www.myWebsite.com',
        };

        const blogResponse = await request(app)
            .post('/blogs')
            .send(blogBody)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.SUCCESS_CREATED_201);

        blog = blogResponse.body;

        expect(blogResponse.body as Blog).toEqual({
            id: expect.any(String),
            name: blogBody.name,
            description: blogBody.description,
            websiteUrl: blogBody.websiteUrl,
            createdAt: expect.any(String),
        });

        // if field has invalidValues
        const badBlogBody = {
            name: badInputModelField,
            description: 'I am the best man',
            websiteUrl: 'www.myWebsite.com',
        };

        await request(app)
            .post('/blogs')
            .send(badBlogBody)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        // if not authorized
        await request(app)
            .post('/blogs')
            .send(blogBody)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    // Get all blogs
    it('Should get all blogs', async () => {
        const blogsResponse = await request(app)
            .get('/blogs')
            .query({ ...queryParams })
            .expect(HTTP_STATUS_CODES.SUCCESS_200);

        expect(blogsResponse.body.items.length).toBe(1);
    });

    // Returns all posts for specified blog
    it('Should return all posts from blog', async () => {
        // Create new post for blog
        const postBody = {
            title: 'new post',
            shortDescription: 'description',
            content: 'content',
            blogId: blog.id,
        };

        const postResponse = await request(app)
            .post('/posts')
            .send(postBody)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.SUCCESS_CREATED_201);

        post = postResponse.body;

        const allPostsFromBlogResponse = await request(app)
            .get(`/blogs/${blog.id}/posts`)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.SUCCESS_200);

        expect(allPostsFromBlogResponse.body.items).toHaveLength(1);

        // If send fake blogId should return 404 NotFound
        await request(app)
            .get(`/blogs/fakeId/posts`)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    // Should create new post for specific blog
    it('Create new post for specific blog', async () => {
        const postBody = {
            title: 'new post',
            shortDescription: 'description',
            content: 'content',
            blogId: blog.id,
        };

        const post = await request(app)
            .post(`/blogs/${blog.id}/posts`)
            .send(postBody)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.SUCCESS_CREATED_201);

        expect(post.body.blogId).toBe(blog.id);

        // If the inputModel has incorrect values
        const incorrectPostBody = {
            title: badInputModelField,
            shortDescription: 'description',
            content: 'content',
            blogId: blog.id,
        };

        await request(app)
            .post(`/blogs/${blog.id}/posts`)
            .send(incorrectPostBody)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        // If unauthorized
        await request(app)
            .post(`/blogs/${blog.id}/posts`)
            .send(postBody)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    // Returns blog by id
    it('Returns blog by id', async () => {
        const blogResponse = await request(app)
            .get(`/blogs/${blog.id}`)
            .expect(HTTP_STATUS_CODES.SUCCESS_200);

        expect(blogResponse.body.id).toBe(blog.id);

        // If fake id
        await request(app)
            .get('/blogs/fakeId')
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    // Update existing Blog by id with InputModel
    it('Update existing Blog by id with InputModel', async () => {
        const bodyForUpdate = {
            name: 'new name',
            description: 'new description',
            websiteUrl: 'www.website.io',
        };

        await request(app)
            .put(`/blogs/${blog.id}`)
            .send(bodyForUpdate)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);

        // If the inputModel has incorrect values
        const badPutBody = {
            ...bodyForUpdate,
            websiteUrl: badInputModelField,
        };

        await request(app)
            .put(`/blogs/${blog.id}`)
            .send(badPutBody)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        // If unauthorized
        await request(app)
            .put(`/blogs/${blog.id}`)
            .send(bodyForUpdate)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

        // If fake id
        await request(app)
            .put(`/blogs/fakeId`)
            .send(bodyForUpdate)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    // Delete blog specified by id
    it('Delete blog specified by id', async () => {
        // If unauthorized
        await request(app)
            .delete(`/blogs/${blog.id}`)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

        // delete should be success
        await request(app)
            .delete(`/blogs/${blog.id}`)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);

        // If fake id
        await request(app)
            .delete('/blogs/fakeId')
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});

// Posts
describe('Posts API', () => {
    let blog: Blog;
    let post: Post;

    // Clear all data
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
    });

    // Create blog for posts
    it('create blog for posts', async () => {
        const blogBody = {
            name: 'New blog',
            description: 'The best blog',
            websiteUrl: 'www.myWebsite.com',
        };

        const blogResponse = await request(app)
            .post('/blogs')
            .send(blogBody)
            .set(AUTHORIZATION_DATA)
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
            .set(AUTHORIZATION_DATA)
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
            .set(AUTHORIZATION_DATA)
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
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);

        // should be unauthorized error (without AUTHORIZATION_DATA)
        await request(app)
            .put(`/posts/${post.id}`)
            .send(goodInputModelBody)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    // Delete post
    // should be unauthorized error (without AUTHORIZATION_DATA)
    it('delete operation for post', async () => {
        await request(app)
            .delete(`/posts/${post.id}`)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

        // should get bad response if post id is fake
        await request(app)
            .delete('/posts/fakePostId')
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);

        // should get success remove post
        await request(app)
            .delete(`/posts/${post.id}`)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
    });
});

// Users
describe('Users API', () => {
    let user: User;
    // Clear all data
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
    });

    // Add new user to the system
    it('Add new user to the system', async () => {
        // If unauthorized
        await request(app)
            .post('/users')
            .send(USER_BODY)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

        // If bad request
        const badUserBody = { ...USER_BODY, email: badInputModelField };
        await request(app)
            .post('/users')
            .set(AUTHORIZATION_DATA)
            .send(badUserBody)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        // Success response
        const userRequest = await request(app)
            .post('/users')
            .set(AUTHORIZATION_DATA)
            .send(USER_BODY)
            .expect(HTTP_STATUS_CODES.SUCCESS_CREATED_201);
        user = userRequest.body;

        expect(typeof userRequest.body.createdAt).toBe('string');
    });

    // Returns all users
    it('Returns all users', async () => {
        const usersResponse = await request(app)
            .get('/users')
            .query(queryParams)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.SUCCESS_200);

        expect(Array.isArray(usersResponse.body.items)).toBeTruthy();

        // If unauthorized
        await request(app)
            .get('/users')
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

        // Create user for test
        const additionalUser = {
            login: 'Vasiliy',
            password: 'qwerty',
            email: 'vasiliy@email.com',
        };

        await request(app)
            .post('/users')
            .set(AUTHORIZATION_DATA)
            .send(additionalUser)
            .expect(HTTP_STATUS_CODES.SUCCESS_CREATED_201);

        // Should return two users
        const getRequest = await request(app)
            .get('/users')
            .set(AUTHORIZATION_DATA)
            .query(queryParams)
            .expect(HTTP_STATUS_CODES.SUCCESS_200);

        expect(getRequest.body.items.length).toBe(2);

        // Find user

        // Find by name
        const queryForLoginSearch: TQueryParams = {
            ...queryParams,
            searchLoginTerm: 'Vas',
        };

        const userByLogin = await request(app)
            .get('/users')
            .query(queryForLoginSearch)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.SUCCESS_200);

        expect(userByLogin.body.items[0].login).toBe(additionalUser.login);
        expect(userByLogin.body.items.length).toBe(1);

        // Find by email
        const queryForEmailSearch: TQueryParams = {
            ...queryParams,
            searchEmailTerm: 'sil',
        };

        const userByEmail = await request(app)
            .get('/users')
            .query(queryForEmailSearch)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.SUCCESS_200);

        expect(userByEmail.body.items[0].email).toBe(additionalUser.email);
        expect(userByEmail.body.items.length).toBe(1);
    });

    // Delete user by Id
    it('Should delete user by id from params', async () => {
        // if not authorized
        await request(app)
            .delete(`/users/${user.id}`)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

        // should remove success
        await request(app)
            .delete(`/users/${user.id}`)
            .set(AUTHORIZATION_DATA)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
    });
});

// JWT Auth
describe('Auth API', () => {
    // to increase the timeout value
    jest.setTimeout(8000);
    let user: User;
    let token: string;
    // Clear all data
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
    });

    // Creating user for test authorization
    it('Creating user for test authorization', async () => {
        const userRequest = await request(app)
            .post('/users')
            .set(AUTHORIZATION_DATA)
            .send(USER_BODY)
            .expect(HTTP_STATUS_CODES.SUCCESS_CREATED_201);
        user = userRequest.body;
    });

    // Do login for get JWT token
    it('should return JWT token', async () => {
        const body = {
            loginOrEmail: USER_BODY.email,
            password: USER_BODY.password,
        };

        const authResponse = await request(app).post('/auth/login').send(body);

        token = authResponse.body.accessToken;

        expect(authResponse.body).toEqual({
            accessToken: expect.any(String),
        });
    });

    it('Should return 401 if input incorrect login or password', async () => {
        const fakeData = {
            login: 'fakeLogin',
            password: 'fakePassword',
        };
        await request(app)
            .post('/auth/login')
            .auth(token, { type: 'bearer' })
            .send(fakeData)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    // it('should return 401 status code because JWT token expired', async () => {
    //     const authResponse = await request(app)
    //         .get('/auth/me')
    //         .auth(token, { type: 'bearer' });
    //
    //     expect(authResponse.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    //     expect(authResponse.body).toEqual({
    //         id: expect.any(String),
    //         login: expect.any(String),
    //         email: expect.any(String),
    //         createdAt: expect.any(String),
    //     });
    //     await sleep(7000);
    //
    //     const authResponseAfterSleep = await request(app)
    //         .get('/auth/me')
    //         .auth(token, { type: 'bearer' });
    //
    //     expect(authResponseAfterSleep.status).toBe(
    //         HTTP_STATUS_CODES.UNAUTHORIZED_401,
    //     );
    // });
});

// Comments
describe('Comments API', () => {
    // Clear all data
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUS_CODES.NO_CONTENT_SUCCESS_204);
    });

    let post: Post;
    let blog: Blog;
    let user: User;
    let token: string;

    // Create blog for posts
    it('create blog for posts', async () => {
        const blogBody = {
            name: 'New blog',
            description: 'The best blog',
            websiteUrl: 'www.myWebsite.com',
        };

        const blogResponse = await request(app)
            .post('/blogs')
            .send(blogBody)
            .set(AUTHORIZATION_DATA)
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

    // Create new post for comments
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
            .set(AUTHORIZATION_DATA)
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

    // Creating user for get authorization token
    it('Creating user for test authorization', async () => {
        const userRequest = await request(app)
            .post('/users')
            .set(AUTHORIZATION_DATA)
            .send(USER_BODY)
            .expect(HTTP_STATUS_CODES.SUCCESS_CREATED_201);
        user = userRequest.body;
    });

    // Do login for get JWT token
    it('should return JWT token', async () => {
        const body = {
            loginOrEmail: USER_BODY.email,
            password: USER_BODY.password,
        };

        const authResponse = await request(app).post('/auth/login').send(body);

        token = authResponse.body.accessToken;

        expect(authResponse.body).toEqual({
            accessToken: expect.any(String),
        });
    });

    // Create new comment for post
    it('Should create new comment for post', async () => {
        const body = {
            content: 'content for comment should be minimum 20 symbols',
        };
        const response = await request(app)
            .post(`/posts/${post.id}/comments`)
            .auth(token, { type: 'bearer' })
            .send(body)
            .expect(HTTP_STATUS_CODES.SUCCESS_200);
        console.log(response.body);
    });
});
