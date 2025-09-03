import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      return res.status(400).send(error);
    }
  };

export default validate;
