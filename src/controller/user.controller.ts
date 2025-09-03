import { Request, Response } from "express";
import logger from "../utils/logger";
import { createUser } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash";

export async function createUserhandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    console.log("inside controller");
    const user = await createUser(req.body);
    return res.send(omit(user, "password"));
  } catch (error) {
    logger.error(error);
    res.status(409).send(error);
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  return res.send(res.locals.user);
}
