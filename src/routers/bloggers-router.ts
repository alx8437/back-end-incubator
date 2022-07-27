import { Request, Response, Router } from "express";
import {
  bloggersFieldsValidation,
  lengthEmptyValidation,
  youtubeUrlValidator,
} from "../utils/validations";
import { getErrorMessage } from "../utils/errors";

import {
  createBlogger,
  deleteBlogger,
  getAllBloggers,
  getBloggerById,
  updateBlogger,
} from "../repository/bloggers-repository";

export const bloggersRouter = Router({});

bloggersRouter.get("/", (req: Request, res: Response) => {
  const bloggers = getAllBloggers();
  res.send(bloggers);
});

bloggersRouter.post("/", (req: Request, res: Response) => {
  const isName = lengthEmptyValidation(req.body.name, 15);
  const isYoutubeUrl = youtubeUrlValidator(req.body.youtubeUrl);
  if (isName && isYoutubeUrl) {
    const blogger = createBlogger(req.body.name, req.body.youtubeUrl);
    res.status(201).send(blogger);
  } else {
    const errorFields: string[] = bloggersFieldsValidation(
      isName,
      isYoutubeUrl
    );
    const errors = getErrorMessage(errorFields);
    res.status(400).send(errors);
  }
});

bloggersRouter.get("/:id", (req: Request, res: Response) => {
  const blogger = getBloggerById(Number(req.params.id));
  if (blogger) {
    res.status(200).send(blogger);
  } else {
    res.send(404);
  }
});

bloggersRouter.put("/:id", (req: Request, res: Response) => {
  const isName = lengthEmptyValidation(req.body.name, 15);
  const isYoutubeUrl = youtubeUrlValidator(req.body.youtubeUrl);

  if (isName && isYoutubeUrl) {
    const isUpdate = updateBlogger(
      Number(req.params.id),
      req.body.name,
      req.body.youtubeUrl
    );
    if (isUpdate) {
      res.send(204);
    } else {
      res.send(404);
    }
  } else {
    const errorFields: string[] = [];
    !isName && errorFields.push("name");
    !isYoutubeUrl && errorFields.push("youtubeUrl");
    const errors = getErrorMessage(errorFields);
    res.status(400).send(errors);
  }
});

bloggersRouter.delete("/:id", (req, res) => {
  const isDeleted = deleteBlogger(Number(req.params.id));
  if (isDeleted) {
    res.send(404);
  } else {
    res.send(204);
  }
});
