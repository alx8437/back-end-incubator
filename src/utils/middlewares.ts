import { NextFunction, Request, Response } from "express";
import { body, Result, validationResult } from "express-validator";
import { getErrorMessage, TError } from "./errors";
import { bloggers } from "../data";

export const errorMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: Result = validationResult(req);

  const errorFields = errors.array().map((error) => error.param);
  const errorMessage: TError = getErrorMessage(errorFields);

  if (!errors.isEmpty()) {
    res.status(400).json(errorMessage);
    return;
  } else {
    next();
  }
};

export const titleValidateMiddleware = body("title")
  .trim()
  .isLength({ min: 1, max: 30 });

export const shortDescriptionValidateMiddleware = body("shortDescription")
  .trim()
  .isLength({ min: 1, max: 100 });

export const contentValidateMiddleware = body("content")
  .trim()
  .isLength({ min: 1, max: 1000 });

export const isCorrectBloggerIdMiddleware = body("bloggerId").custom(
  (bloggerId) => {
    const currentBlogger = bloggers.find((blogger) => blogger.id === bloggerId);
    if (currentBlogger) return true;
  }
);

export const bloggerNameValidateMiddleware = body("name")
  .trim()
  .isLength({ min: 1, max: 15 });

export const youtubeUrlValidateMiddleware = body("youtubeUrl")
  .trim()
  .isURL()
  .isLength({ max: 100 });
