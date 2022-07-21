export const getErrorMessage = (fieldName: string, message?: string) => {
  const defaultError: string = "You entered an invalid value";

  return {
    errorsMessages: [
      {
        message: message || defaultError,
        field: fieldName,
      },
    ],
  };
};
