import { MongoClient } from 'mongodb';
import { Blog } from '../services/blogs-service';
import { Post } from '../services/posts-service';
import { TUserDBType } from './user-repository';

const mongoURI =
    process.env.mongoURI ||
    'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.3';

const client = new MongoClient(mongoURI);

const DATA_BASE_BLOGGER = client.db('blogs');

export const blogsCollection = DATA_BASE_BLOGGER.collection<Blog>('blogs');

export const postsCollection = DATA_BASE_BLOGGER.collection<Post>('posts');

export const usersCollection =
    DATA_BASE_BLOGGER.collection<TUserDBType>('users');

export async function runDB() {
    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    await client.db('blogs').command({ ping: 1 });
    try {
    } catch {
        console.log('can not connect to db');
    }
}
