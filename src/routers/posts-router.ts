import { Request, Response, Router } from "express";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
  updatePost,
} from "../repository/posts-repository";
import { Post } from "../data/posts";
import {
  contentValidateMiddleware,
  errorMiddleWare,
  isCorrectBloggerIdMiddleware,
  shortDescriptionValidateMiddleware,
  titleValidateMiddleware,
} from "../utils/middlewares";

export const postsRouter = Router({});

postsRouter.get("/", (req: Request, res: Response) => {
  const posts = getPosts();
  res.send(posts);
});

postsRouter.post(
  "/",
  titleValidateMiddleware,
  shortDescriptionValidateMiddleware,
  contentValidateMiddleware,
  isCorrectBloggerIdMiddleware,
  // should be last
  errorMiddleWare,
  async (req: Request, res: Response) => {
    const { title, bloggerId, shortDescription, content } = req.body;
    const newPost: Post = await createPost(
      title,
      bloggerId,
      shortDescription,
      content
    );

    res.status(201).send(newPost);
  }
);

postsRouter.put(
  "/:id",
  titleValidateMiddleware,
  shortDescriptionValidateMiddleware,
  contentValidateMiddleware,
  isCorrectBloggerIdMiddleware,
  // should be last
  errorMiddleWare,
  async (req: Request, res: Response) => {
    const isUpdated: boolean = await updatePost(
      Number(req.params.id),
      req.body
    );

    if (isUpdated) {
      res.send(204);
    } else {
      res.send(404);
    }
  }
);

postsRouter.get("/:id", async (req: Request, res: Response) => {
  const postById: Post | undefined = await getPostById(Number(req.params.id));

  if (postById) {
    res.send(postById);
  } else {
    res.send(404);
  }
});

postsRouter.delete("/:id", async (req: Request, res: Response) => {
  const isDeleted: boolean = await deletePostById(Number(req.params.id));

  if (isDeleted) {
    res.send(204);
  } else {
    res.send(404);
  }
});
