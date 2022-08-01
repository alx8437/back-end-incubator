import { bloggers } from "../data";
import { Blogger } from "../data/bloggers";

export const createBlogger = async (
  name: string,
  youtubeUrl: string
): Promise<Blogger> => {
  const newBlogger = {
    id: Number(new Date()),
    name,
    youtubeUrl,
  };

  await bloggers.push(newBlogger);

  return newBlogger;
};

export const getAllBloggers = () => {
  return bloggers;
};

export const getBloggerById = async (
  id: number
): Promise<Promise<Blogger> | undefined> => {
  const blogger = await bloggers.find((blogger) => blogger.id === id);

  return blogger ? blogger : undefined;
};

export const updateBlogger = async (
  id: number,
  name: string,
  youtubeUrl: string
): Promise<boolean> => {
  const blogger = await bloggers.find((blogger) => blogger.id === id);

  if (!blogger) {
    return false;
  } else {
    blogger.name = name;
    blogger.youtubeUrl = youtubeUrl;
    return true;
  }
};

export const deleteBlogger = async (id: number): Promise<boolean> => {
  const index = await bloggers.findIndex((blogger) => blogger.id === id);
  if (index > -1) {
    bloggers.splice(index, 1);
    return true;
  }

  return false;
};
