import { bloggers, posts } from "../data";
import { Blogger } from "../data/bloggers";
import { lengthEmptyValidation } from "../utils/validations";
import { Post } from "../data/posts";
import { getErrorMessage, TError } from "../utils/errors";

export const getPosts = () => {
  return posts;
};

export const createPost = (
  title: string,
  bloggerId: number,
  shortDescription: string,
  content: string,
  currentBlogger: Blogger
): Post => {
  const newPost: Post = {
    id: Number(new Date()),
    title: title,
    shortDescription: shortDescription,
    content: content,
    bloggerId: bloggerId,
    bloggerName: currentBlogger.name,
  };
  posts.push(newPost);
  return newPost;
};

export const updatePost = (
  id: number,
  body: {
    content: string;
    title: string;
    bloggerId: number;
    shortDescription: string;
  }
): "true" | "false" | TError => {
  const { content, bloggerId, title, shortDescription } = body;

  const currentPost = posts.find((post) => post.id === Number(id));
  const currentBlogger = bloggers.find((blogger) => blogger.id === bloggerId);

  if (!currentPost) {
    return "false";
  }

  const isPutTitle = lengthEmptyValidation(title, 30);
  const isBloggerId = !!bloggerId && currentBlogger;
  const isShortDescription = lengthEmptyValidation(shortDescription, 100);
  const isContent = lengthEmptyValidation(content, 1000);
  const blogger = bloggers.find((blogger) => blogger.id === bloggerId);

  if (isPutTitle && isBloggerId && isShortDescription && isContent && blogger) {
    for (let i = 0; i < posts.length; i += 1) {
      if (posts[i].id === Number(id)) {
        posts[i] = {
          ...posts[i],
          title: title,
          bloggerId,
          shortDescription,
          content,
        };
      }
    }

    return "true";
  } else {
    const errorFields: string[] = [];
    !isPutTitle && errorFields.push("title");
    !isBloggerId && errorFields.push("bloggerId");
    !isContent && errorFields.push("content");
    !isShortDescription && errorFields.push("shortDescription");

    const error: TError = getErrorMessage(errorFields);
    return error;
  }
};

export const getPostById = (id: number) => {
  const post: Post | undefined = posts.find((post) => post.id === id);

  return post;
};

export const deletePostById = (id: number): boolean => {
  const index = posts.findIndex((post) => post.id === id);

  if (index > -1) {
    posts.splice(index, 1);
    return true;
  }

  return false;
};
