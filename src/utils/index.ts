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
    return Math.ceil(itemCount / pageSize) | 1;
};
