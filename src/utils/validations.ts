export const titleValidation = (title: string | null) => {
  if (!title) {
    return false;
  }

  return !!(title.length && title.length < 40);
};
