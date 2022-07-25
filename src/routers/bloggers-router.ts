import { Request, Response, Router } from "express";
import {
  lengthEmptyValidation,
  youtubeUrlValidator,
} from "../utils/validations";
import { getErrorMessage } from "../utils/errors";
import { bloggers } from "../data";

export const bloggersRouter = Router({});

bloggersRouter.get("/", (req: Request, res: Response) => {
  res.send(bloggers);
});

bloggersRouter.post("/", (req: Request, res: Response) => {
  const isName = lengthEmptyValidation(req.body.name, 15);
  const isYoutubeUrl = youtubeUrlValidator(req.body.youtubeUrl);

  if (isName && isYoutubeUrl) {
    const newBlogger = {
      id: Number(new Date()),
      name: req.body.name,
      youtubeUrl: req.body.youtubeUrl,
    };

    bloggers.push(newBlogger);
    res.status(201).send(newBlogger);
  } else {
    const errorFields: string[] = [];
    !isName && errorFields.push("name");
    !isYoutubeUrl && errorFields.push("youtubeUrl");
    const errors = getErrorMessage(errorFields);
    res.status(400).send(errors);
  }
});

bloggersRouter.get("/:id", (req: Request, res: Response) => {
  const blogger = bloggers.find(
    (blogger) => blogger.id === Number(req.params.id)
  );

  if (blogger) {
    res.status(200).send(blogger);
  } else {
    res.send(404);
  }
});

bloggersRouter.put("/:id", (req: Request, res: Response) => {
  const blogger = bloggers.find(
    (blogger) => blogger.id === Number(req.params.id)
  );

  if (!blogger) {
    res.send(404);
    return;
  }

  const isName = lengthEmptyValidation(req.body.name, 15);
  const isYoutubeUrl = youtubeUrlValidator(req.body.youtubeUrl);

  if (isName && isYoutubeUrl) {
    blogger.name = req.body.name;
    blogger.youtubeUrl = req.body.youtubeUrl;
    res.send(204);
  } else {
    const errorFields: string[] = [];
    !isName && errorFields.push("name");
    !isYoutubeUrl && errorFields.push("youtubeUrl");
    const errors = getErrorMessage(errorFields);
    res.status(400).send(errors);
  }
});

bloggersRouter.delete("/:id", (req, res) => {
  const index = bloggers.findIndex(
    (blogger) => blogger.id === Number(req.params.id)
  );

  if (index === -1) {
    res.send(404);
    return;
  }

  bloggers.splice(index, 1);
  res.send(204);
});
