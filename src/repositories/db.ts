import { MongoClient } from 'mongodb';
import { Blogger } from '../services/bloggers-service';
import { Post } from '../services/posts-service';

const mongoURI =
    process.env.mongoURI ||
    'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.3';

const client = new MongoClient(mongoURI);

const DATA_BASE_BLOGGER = client.db('bloggers');

export const bloggersCollection =
    DATA_BASE_BLOGGER.collection<Blogger>('bloggers');

export const postCollection = DATA_BASE_BLOGGER.collection<Post>('posts');

export async function runDB() {
    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    await client.db('bloggers').command({ ping: 1 });
    try {
    } catch {
        console.log('can not connect to db');
    }
}
