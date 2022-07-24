export const getErrorMessage = (fieldNames: string[], message?: string): {} => {
  const defaultError: string = "You entered an invalid value";

  const errorsMessages = fieldNames.map((fieldName) => ({
    message: message || defaultError,
    field: fieldName,
  }));

  return { errorsMessages };
};
