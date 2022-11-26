import { Router, Request, Response } from 'express';
import { testingService } from '../services/testing-service';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    const isDeleted: boolean = await testingService.deleteAllData();

    if (isDeleted) {
        res.sendStatus(204);
    }
});
