import express, { Response, Request } from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const corsMiddleware = cors();
const bodyParserMiddleware = bodyParser();

app.use(corsMiddleware);
app.use(bodyParserMiddleware);

const port = process.env.PORT || 5000;

const products = [
  { id: 0, title: "cheese" },
  { id: 1, title: "mushrooms" },
];

app.get("/", (req: Request, res: Response) => {
  let helloWorld = "Go study123123123";
  res.send(helloWorld);
});

app.get("/products", (req: Request, res: Response) => {
  const searchString = req.query.title as string;
  console.log(searchString);
  if (searchString) {
    res.send(
      products.filter((product) => product.title.indexOf(searchString) > -1)
    );
  } else {
    res.send(products);
  }
});

app.get("/products/:id", (req: Request, res: Response) => {
  const product = products.find(
    (product) => product.id === Number(req.params.id)
  );

  if (product) {
    res.send(product);
  } else {
    res.send(404);
  }
});

app.put("/products/:id", (req: Request, res: Response) => {
  const product = products.find(
    (product) => product.id === Number(req.params.id)
  );

  if (product) {
    product.title = req.body.title;
    res.send(product);
  } else {
    res.send(404);
  }
});

app.post("/products", (req: Request, res: Response) => {
  const newProduct = {
    id: Number(new Date()),
    title: req.body.title,
  };

  products.push(newProduct);
  res.status(201).send(newProduct);
});

app.delete("/products/:id", (req: Request, res: Response) => {
  const index = products.findIndex(
    (product) => product.id === Number(req.params.id)
  );
  if (index > -1) {
    products.splice(index, 1);
    res.send(204);
  } else {
    res.send(404);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
