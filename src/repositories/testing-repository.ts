import { DeleteResult } from 'mongodb';
import { bloggersCollection, postCollection } from './db';

export const testingRepository = {
    async deleteAllData(): Promise<boolean> {
        const deleteBloggersResult: DeleteResult =
            await bloggersCollection.deleteMany({});

        const deletePostsResult: DeleteResult = await postCollection.deleteMany(
            {},
        );

        return (
            deleteBloggersResult.acknowledged && deletePostsResult.acknowledged
        );
    },
};
