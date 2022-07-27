import { bloggers } from "../data";

export const createBlogger = (name: string, youtubeUrl: string) => {
  const newBlogger = {
    id: Number(new Date()),
    name,
    youtubeUrl,
  };

  bloggers.push(newBlogger);

  return newBlogger;
};

export const getAllBloggers = () => {
  return bloggers;
};

export const getBloggerById = (id: number) => {
  const blogger = bloggers.find((blogger) => blogger.id === id);

  return blogger ? blogger : undefined;
};

export const updateBlogger = (id: number, name: string, youtubeUrl: string) => {
  const blogger = bloggers.find((blogger) => blogger.id === id);

  if (!blogger) {
    return false;
  } else {
    blogger.name = name;
    blogger.youtubeUrl = youtubeUrl;
    return true;
  }
};

export const deleteBlogger = (id: number): boolean => {
  const index = bloggers.findIndex((blogger) => blogger.id === id);
  if (index > -1) {
    bloggers.splice(index, 1);
    return true;
  }

  return false;
};
