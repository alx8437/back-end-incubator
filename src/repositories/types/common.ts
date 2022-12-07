import { Query } from 'express-serve-static-core';

export type TQueryParams = {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    searchNameTerm?: string;
    searchLoginTerm?: string | null;
    searchEmailTerm?: string | null;
};

export type TQueryParamsTypes = Query & TQueryParams;

export type GetItemsPayload<T> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: Array<T>;
    searchNameTerm?: string;
};
