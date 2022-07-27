import { Request, Response, Router } from "express";
import { lengthEmptyValidation } from "../utils/validations";
import { getErrorMessage, TError } from "../utils/errors";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
  updatePost,
} from "../repository/posts-repository";
import { bloggers } from "../data";
import { Post } from "../data/posts";

export const postsRouter = Router({});

postsRouter.get("/", (req: Request, res: Response) => {
  const posts = getPosts();
  res.send(posts);
});

postsRouter.post("/", (req: Request, res: Response) => {
  const { title, bloggerId, shortDescription, content } = req.body;
  const currentBlogger = bloggers.find(
    (blogger) => blogger.id === req.body.bloggerId
  );
  const isPostTitle = lengthEmptyValidation(req.body.title, 30);
  const isBloggerId = !!req.body.bloggerId && currentBlogger;
  const isShortDescription = lengthEmptyValidation(
    req.body.shortDescription,
    100
  );
  const isContent = lengthEmptyValidation(req.body.content, 1000);
  if (
    isPostTitle &&
    isBloggerId &&
    isShortDescription &&
    isContent &&
    currentBlogger
  ) {
    const newPost = createPost(
      title,
      bloggerId,
      shortDescription,
      content,
      currentBlogger
    );
    res.status(201).send(newPost);
  }

  const errorFields: string[] = [];
  !isPostTitle && errorFields.push("title");
  !isBloggerId && errorFields.push("bloggerId");
  !isContent && errorFields.push("content");
  !isShortDescription && errorFields.push("shortDescription");

  const errors = getErrorMessage(errorFields);

  res.status(400).send(errors);
});

postsRouter.put("/:id", (req: Request, res: Response) => {
  const isUpdated: "true" | "false" | TError = updatePost(
    Number(req.params.id),
    req.body
  );

  if (isUpdated === "true") {
    res.send(204);
  } else if (isUpdated === "false") {
    res.send(404);
  } else {
    res.status(400).send(isUpdated as TError);
  }
});

postsRouter.get("/:id", (req: Request, res: Response) => {
  const postById: Post | undefined = getPostById(Number(req.params.id));

  if (postById) {
    res.send(postById);
  }
  res.send(404);
});

postsRouter.delete("/:id", (req: Request, res: Response) => {
  const isDeleted: boolean = deletePostById(Number(req.params.id));

  if (isDeleted) {
    res.send(204);
  } else {
    res.send(404);
  }
});
