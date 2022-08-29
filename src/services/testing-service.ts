import { testingRepository } from '../repositories/testing-repository';

export const testingService = {
    async deleteAllData(): Promise<boolean> {
        return await testingRepository.deleteAllData();
    },
};
