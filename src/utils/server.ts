import express, { Request, Response } from "express";
import responseTime from "response-time";
import { deserializeaUser } from "../middleware/deserializeUser";
import routes from "../routes";
import cors from "cors";
import config from "config";
import cookieParser from "cookie-parser";
import { restResponseTimeHistogram, startMetricsServer } from "./metrics";
import swaggerDocs from "./swagger";

function createServer() {
  const port = config.get<number>("port");
  console.log("inside create");
  const app = express();

  app.use(
    cors({
      origin: config.get("origin"),
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use(express.json());

  app.use(deserializeaUser);

  app.use(
    responseTime((req: Request, res: Response, time: number) => {
      if (req?.route?.path) {
        restResponseTimeHistogram.observe(
          {
            method: req.method,
            route: req.route.path,
            status_code: res.statusCode,
          },
          time * 1000
        );
      }
    })
  );

  routes(app);

  startMetricsServer(9001);

  return app;
}
export default createServer;
