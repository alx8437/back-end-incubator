export const removeProperty = (object: any, property: string): Object => {
    const properties: string[] = Object.getOwnPropertyNames(object);
    const isInclude = properties.includes(property);
    if (isInclude) {
        delete object[property];
        return object;
    }
    return object;
};
