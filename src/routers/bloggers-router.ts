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
import { Blogger } from "../data/bloggers";

export const bloggersRouter = Router({});

bloggersRouter.get("/", (req: Request, res: Response) => {
  const bloggers: Blogger[] = getAllBloggers();
  res.send(bloggers);
});

bloggersRouter.post(
  "/",
  bloggerNameValidateMiddleware,
  youtubeUrlValidateMiddleware,
  // should be last
  errorMiddleWare,
  async (req: Request, res: Response) => {
    const blogger: Blogger = await createBlogger(
      req.body.name,
      req.body.youtubeUrl
    );
    res.status(201).send(blogger);
  }
);

bloggersRouter.get("/:id", async (req: Request, res: Response) => {
  const blogger: Blogger | undefined = await getBloggerById(
    Number(req.params.id)
  );
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
  async (req: Request, res: Response) => {
    const isUpdate: boolean = await updateBlogger(
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

bloggersRouter.delete("/:id", async (req, res) => {
  const isDeleted: boolean = await deleteBlogger(Number(req.params.id));
  if (isDeleted) {
    res.send(204);
  } else {
    res.send(404);
  }
});
