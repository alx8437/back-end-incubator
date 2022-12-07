import { query } from 'express-validator';

export const pageNumberSanitizer = query('pageNumber').toInt().default(1);

export const pageSizeSanitizer = query('pageSize').toInt().default(10);

export const searchNameTermSanitizer = query('searchNameTerm').default('');

export const sortBySanitizer = query('sortBy').default('createdAt');

export const sortDirectionSanitizer = query('sortDirection').default('desc');

export const searchLoginTermSanitizer = query('searchLoginTerm').default(null);

export const searchEmailTermSanitizer = query('searchEmailTerm').default(null);
