export const titleValidation = (title: string) => {
  if (title.length && title.length < 40) {
    return true;
  }

  return false;
};
