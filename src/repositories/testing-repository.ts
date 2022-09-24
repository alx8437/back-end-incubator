import { DeleteResult } from 'mongodb';
import { blogsCollection, postCollection } from './db';

export const testingRepository = {
    async deleteAllData(): Promise<boolean> {
        const deleteBloggersResult: DeleteResult =
            await blogsCollection.deleteMany({});

        const deletePostsResult: DeleteResult = await postCollection.deleteMany(
            {},
        );

        return (
            deleteBloggersResult.acknowledged && deletePostsResult.acknowledged
        );
    },
};
