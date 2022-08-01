import { bloggers, posts } from "../data";
import { Post } from "../data/posts";

export const getPosts = () => {
  return posts;
};

export const createPost = async (
  title: string,
  bloggerId: number,
  shortDescription: string,
  content: string
): Promise<Post> => {
  const currentBlogger = bloggers.find((blogger) => blogger.id === bloggerId);

  const newPost: Post = {
    id: Number(new Date()),
    title,
    shortDescription,
    content,
    bloggerId,
    // this value has validated middleware isCorrectBloggerIdMiddleware()
    bloggerName: currentBlogger!.name,
  };
  posts.push(newPost);
  return newPost;
};

export const updatePost = async (
  id: number,
  body: {
    content: string;
    title: string;
    bloggerId: number;
    shortDescription: string;
  }
): Promise<boolean> => {
  const { content, bloggerId, title, shortDescription } = body;

  const currentPost = await posts.find((post) => post.id === Number(id));

  if (!currentPost) {
    return false;
  }

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
  return true;
};

export const getPostById = async (
  id: number
): Promise<Promise<Post> | undefined> => {
  const post: Post | undefined = posts.find((post) => post.id === id);

  return post;
};

export const deletePostById = async (id: number): Promise<boolean> => {
  const index = await posts.findIndex((post) => post.id === id);

  if (index > -1) {
    posts.splice(index, 1);
    return true;
  }

  return false;
};
