import { Request } from 'express';
import { Query } from 'express-serve-static-core';
import {
    ParamsBlogPost,
    QueryParamsTypes,
} from '../repositories/QueryRepositories/blogsQueryRepository';

export const removeProperty = (object: any, property: string): Object => {
    const properties: string[] = Object.getOwnPropertyNames(object);
    const isInclude = properties.includes(property);
    if (isInclude) {
        delete object[property];
        return object;
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
    const queryParams = req.query as QueryParamsTypes;
    return { id, queryParams };
};
