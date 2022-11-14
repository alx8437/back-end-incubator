import { DeleteResult } from 'mongodb';
import { blogsCollection, postsCollection } from './db';

export const testingRepository = {
    async deleteAllData(): Promise<boolean> {
        const deleteBloggersResult: DeleteResult =
            await blogsCollection.deleteMany({});

        const deletePostsResult: DeleteResult =
            await postsCollection.deleteMany({});

        return (
            deleteBloggersResult.acknowledged && deletePostsResult.acknowledged
        );
    },
};
