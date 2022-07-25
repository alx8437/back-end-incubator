import { Request, Response, Router } from "express";
import { lengthEmptyValidation } from "../utils/validations";
import { getErrorMessage } from "../utils/errors";
import { posts, bloggers } from "../data";

export const postsRouter = Router({});

postsRouter.get("/", (req: Request, res: Response) => {
  res.send(posts);
});

postsRouter.post("/", (req: Request, res: Response) => {
  const currentBlogger = bloggers.find(
    (blogger) => blogger.id === req.body.bloggerId
  );

  const isTitle = lengthEmptyValidation(req.body.title, 30);
  const isBloggerId = !!req.body.bloggerId && currentBlogger;
  const isShortDescription = lengthEmptyValidation(
    req.body.shortDescription,
    100
  );
  const isContent = lengthEmptyValidation(req.body.content, 1000);
  const blogger = bloggers.find((blogger) => blogger.id === req.body.bloggerId);

  if (isTitle && isBloggerId && isShortDescription && isContent && blogger) {
    const newPost = {
      id: Number(new Date()),
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      bloggerId: req.body.bloggerId,
      bloggerName: blogger.name,
    };
    posts.push(newPost);
    res.status(201).send(newPost);
  }

  const errorFields: string[] = [];
  !isTitle && errorFields.push("title");
  !isBloggerId && errorFields.push("bloggerId");
  !isContent && errorFields.push("content");
  !isShortDescription && errorFields.push("shortDescription");

  const errors = getErrorMessage(errorFields);

  res.status(400).send(errors);
});

postsRouter.put("/:id", (req: Request, res: Response) => {
  const currentPost = posts.find((post) => post.id === Number(req.params.id));
  const currentBlogger = bloggers.find(
    (blogger) => blogger.id === req.body.bloggerId
  );

  if (!currentPost) {
    res.send(404);
    return;
  }

  const isTitle = lengthEmptyValidation(req.body.title, 30);
  const isBloggerId = !!req.body.bloggerId && currentBlogger;
  const isShortDescription = lengthEmptyValidation(
    req.body.shortDescription,
    100
  );
  const isContent = lengthEmptyValidation(req.body.content, 1000);
  const blogger = bloggers.find((blogger) => blogger.id === req.body.bloggerId);

  if (isTitle && isBloggerId && isShortDescription && isContent && blogger) {
    for (let i = 0; i < posts.length; i += 1) {
      if (posts[i].id === Number(req.params.id)) {
        posts[i] = {
          ...posts[i],
          title: req.body.title,
          bloggerId: req.body.bloggerId,
          shortDescription: req.body.shortDescription,
          content: req.body.content,
        };
      }
    }

    res.send(204);
  } else {
    const errorFields: string[] = [];
    !isTitle && errorFields.push("title");
    !isBloggerId && errorFields.push("bloggerId");
    !isContent && errorFields.push("content");
    !isShortDescription && errorFields.push("shortDescription");

    const errors = getErrorMessage(errorFields);
    res.status(400).send(errors);
  }
});

postsRouter.get("/:id", (req: Request, res: Response) => {
  if (!req.params.id) {
    res.send(404);
    return;
  }
  const post = posts.find((post) => post.id === Number(req.params.id));

  if (post) {
    res.send(post);
  } else {
    res.send(404);
  }
});

postsRouter.delete("/:id", (req: Request, res: Response) => {
  if (!req.params.id) {
    res.send(404);
    return;
  }
  const index = posts.findIndex((post) => post.id === Number(req.params.id));

  if (index > -1) {
    posts.splice(index, 1);
    res.send(204);
  } else {
    res.send(404);
  }
});
