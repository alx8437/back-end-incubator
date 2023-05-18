import { Request } from 'express';
import { TQueryParamsTypes } from '../repositories/types';

export const removeProperties = (object: any, remove: string[]): Object => {
    for (const field of remove) {
        if (field in object) {
            delete object[field];
        }
    }

    return object;
};

export const getSkipCount = (pageNumber: number, pageSize: number): number => {
    return (pageNumber - 1) * pageSize;
};

export const getPageCount = (itemCount: number, pageSize: number) => {
    return pageSize === 0 ? 1 : Math.ceil(itemCount / pageSize);
};

export const getQueryParams = (req: Request) => {
    const { id } = req.params;
    const queryParams = req.query as TQueryParamsTypes;
    return { id, queryParams };
};
