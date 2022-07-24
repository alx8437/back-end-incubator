export const lengthEmptyValidation = (
  field: string | null,
  maxLength: number
): boolean => {
  if (!field) {
    return false;
  }

  return !!(field.length && field.length < maxLength);
};

export const isNumberValidation = (num: Number) => {
  return typeof num === "number";
};

export const youtubeUrlValidator = (link: string | null): boolean => {
  if (!link) {
    return false;
  }

  const maxLength = 100;

  const regexp =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

  const isUrl = regexp.test(link);

  return isUrl && !!(link.length < maxLength);
};
