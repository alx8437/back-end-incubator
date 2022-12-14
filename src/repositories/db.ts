import { MongoClient } from 'mongodb';
import { Blog } from '../services/blogs-service';
import { Post } from '../services/posts-service';
import { TUserDBType } from './user-repository';
import * as dotenv from 'dotenv';

dotenv.config();
const mongoURI = process.env.MONGO_URL;

if (!mongoURI) {
    throw new Error('url is not found');
}

const client = new MongoClient(mongoURI);

export const blogsCollection = client.db().collection<Blog>('blogs');
export const postsCollection = client.db().collection<Post>('posts');
export const usersCollection = client
    .db('inc-users')
    .collection<TUserDBType>('users');

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
