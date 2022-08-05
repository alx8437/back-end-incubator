export type TErrorsMessage = {
    message: string;
    field: string;
};

export type TError = {
    errorsMessages: TErrorsMessage[];
};

export const getErrorMessage = (
    fieldNames: string[],
    message?: string,
): TError => {
    const defaultError: string = 'You entered an invalid value';

    const errorsMessages: Array<TErrorsMessage> = fieldNames.map(
        (fieldName) => ({
            message: message || defaultError,
            field: fieldName,
        }),
    );

    return { errorsMessages };
};
