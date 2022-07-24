import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  isNumberValidation,
  lengthEmptyValidation,
  youtubeUrlValidator,
} from "./utils/validations";
import { getErrorMessage } from "./utils/errors";

const app = express();
const corsMiddleware = cors();
const bodyParserMiddleware = bodyParser();

app.use(corsMiddleware);
app.use(bodyParserMiddleware);

const port = process.env.PORT || 5000;

const bloggers = [
  {
    id: 0,
    name: "string",
    youtubeUrl: "string",
  },
  {
    id: 1,
    name: "string",
    youtubeUrl: "string",
  },
  {
    id: 2,
    name: "string",
    youtubeUrl: "string",
  },
  {
    id: 3,
    name: "string",
    youtubeUrl: "string",
  },
];
const posts = [
  {
    id: 0,
    title: "string",
    shortDescription: "string",
    content: "string",
    bloggerId: 0,
    bloggerName: "string",
  },
  {
    id: 1,
    title: "string",
    shortDescription: "string",
    content: "string",
    bloggerId: 0,
    bloggerName: "string",
  },
  {
    id: 2,
    title: "string",
    shortDescription: "string",
    content: "string",
    bloggerId: 0,
    bloggerName: "string",
  },
];

app.get("/", (req: Request, res: Response) => {
  res.send(`App has started on ${port} port`);
});

// Bloggers
app.get("/bloggers", (req: Request, res: Response) => {
  res.send(bloggers);
});

app.post("/bloggers", (req: Request, res: Response) => {
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

app.get("/bloggers/:id", (req: Request, res: Response) => {
  const blogger = bloggers.find(
    (blogger) => blogger.id === Number(req.params.id)
  );

  if (blogger) {
    res.status(200).send(blogger);
  } else {
    res.send(404);
  }
});

app.put("/bloggers/:id", (req: Request, res: Response) => {
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

app.delete("/bloggers/:id", (req, res) => {
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

// Posts
app.get("/posts", (req: Request, res: Response) => {
  res.send(posts);
});

app.post("/posts", (req: Request, res: Response) => {
  const isTitle = lengthEmptyValidation(req.body.title, 30);
  const isBloggerId = isNumberValidation(req.body.bloggerId);
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

app.put("/posts/:id", (req: Request, res: Response) => {
  if (!req.params.id) {
    res.send(404);
    return;
  }
  const isTitle = lengthEmptyValidation(req.body.title, 30);
  const isBloggerId = isNumberValidation(req.body.bloggerId);
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
    res.status(400).send(errors);
  }
});

app.get("/posts/:id", (req: Request, res: Response) => {
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

app.delete("/posts/:id", (req: Request, res: Response) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
