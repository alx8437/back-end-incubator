import express, { Response, Request } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { titleValidation } from "./utils/validations";
import { getErrorMessage } from "./utils/errors";

const app = express();
const corsMiddleware = cors();
const bodyParserMiddleware = bodyParser();

app.use(corsMiddleware);
app.use(bodyParserMiddleware);

const port = process.env.PORT || 5000;

const videos = [
  { id: 1, title: "About JS - 01", author: "it-incubator.eu" },
  { id: 2, title: "About JS - 02", author: "it-incubator.eu" },
  { id: 3, title: "About JS - 03", author: "it-incubator.eu" },
  { id: 4, title: "About JS - 04", author: "it-incubator.eu" },
  { id: 5, title: "About JS - 05", author: "it-incubator.eu" },
];

app.get("/", (req: Request, res: Response) => {
  res.send(`App has started on ${port} port`);
});

app.get("/videos", (req: Request, res: Response) => {
  res.send(videos);
});

app.get("/videos/:id", (req: Request, res: Response) => {
  const video = videos.find((video) => video.id === Number(req.params.id));

  if (video) {
    res.send(video);
  } else {
    res.send(404);
  }
});

app.post("/videos", (req: Request, res: Response) => {
  const { title } = req.body;

  if (titleValidation(title)) {
    const newVideo = {
      id: Number(new Date()),
      title: req.body.title,
      author: "it-incubator.eu",
    };

    videos.push(newVideo);
    res.status(201).send(newVideo);
  } else {
    res.status(400).send(getErrorMessage("title"));
  }
});

app.delete("/videos/:id", (req: Request, res: Response) => {
  const index = videos.findIndex((video) => video.id === Number(req.params.id));

  if (index > -1) {
    videos.splice(index, 1);
    res.send(204);
  } else {
    res.send(404);
  }
});

app.put("/videos/:id", (req, res) => {
  if (!req.params.id) {
    res.send(404);
  }

  const { title } = req.body;
  const video = videos.find((video) => video.id === Number(req.params.id));

  if (!video) {
    res.send(404);
  }

  if (titleValidation(title) && video) {
    video.title = title;
    res.status(204).send(video);
  } else {
    res.status(400).send(getErrorMessage("title"));
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
