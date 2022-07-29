import { Request, Response, Router } from "express";

import {
  createBlogger,
  deleteBlogger,
  getAllBloggers,
  getBloggerById,
  updateBlogger,
} from "../repository/bloggers-repository";
import {
  bloggerNameValidateMiddleware,
  errorMiddleWare,
  youtubeUrlValidateMiddleware,
} from "../utils/middlewares";

export const bloggersRouter = Router({});

bloggersRouter.get("/", (req: Request, res: Response) => {
  const bloggers = getAllBloggers();
  res.send(bloggers);
});

bloggersRouter.post(
  "/",
  bloggerNameValidateMiddleware,
  youtubeUrlValidateMiddleware,
  // should be last
  errorMiddleWare,
  (req: Request, res: Response) => {
    const blogger = createBlogger(req.body.name, req.body.youtubeUrl);
    res.status(201).send(blogger);
  }
);

bloggersRouter.get("/:id", (req: Request, res: Response) => {
  const blogger = getBloggerById(Number(req.params.id));
  if (blogger) {
    res.status(200).send(blogger);
  } else {
    res.send(404);
  }
});

bloggersRouter.put(
  "/:id",
  bloggerNameValidateMiddleware,
  youtubeUrlValidateMiddleware,
  errorMiddleWare,
  (req: Request, res: Response) => {
    const isUpdate: boolean = updateBlogger(
      Number(req.params.id),
      req.body.name,
      req.body.youtubeUrl
    );

    if (isUpdate) {
      res.send(204);
    } else {
      res.send(404);
    }
  }
);

bloggersRouter.delete("/:id", (req, res) => {
  const isDeleted = deleteBlogger(Number(req.params.id));
  if (isDeleted) {
    res.send(204);
  } else {
    res.send(404);
  }
});
