import { User } from '../../services/user-service';
import { TQueryParamsTypes } from '../types';
import { getPageCount, getSkipCount } from '../../utils';
import { usersCollection } from '../db';

export type TGetQueryUserPayload = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: Array<User>;
};

export const userQueryRepository = {
    async getAllUsers(queryParams: TQueryParamsTypes) {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm,
        } = queryParams;

        const skipCount = getSkipCount(pageNumber, pageSize);
        const filter = this._getFilter(searchLoginTerm, searchEmailTerm);

        const users: User[] = await usersCollection
            .find(filter, {
                projection: {
                    _id: 0,
                    passwordHash: false,
                    passwordSalt: false,
                },
            })
            .sort(sortBy, sortDirection)
            .skip(skipCount)
            .limit(pageSize)
            .toArray();

        const totalCount = await usersCollection.countDocuments(filter);

        const pagesCount = getPageCount(totalCount, pageSize);

        const body: TGetQueryUserPayload = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: users,
        };

        return body;
    },
    _getFilter(
        searchLoginTerm: string | null | undefined,
        searchEmailTerm: string | null | undefined,
    ) {
        if (searchLoginTerm && searchEmailTerm) {
            return {
                $or: [
                    { login: RegExp(searchLoginTerm, 'i') },
                    { email: RegExp(searchEmailTerm, 'i') },
                ],
            };
        }
        if (searchLoginTerm) {
            return { login: RegExp(searchLoginTerm, 'i') };
        }
        if (searchEmailTerm) {
            return { email: RegExp(searchEmailTerm, 'i') };
        }
        return {};
    },
};
