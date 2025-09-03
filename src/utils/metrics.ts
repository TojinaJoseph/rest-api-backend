import express from "express";
import client from "prom-client";
import logger from "./logger";

const app = express();

export const restResponseTimeHistogram = new client.Histogram({
  name: "rest_response_time_duration_seconds",
  help: "Response time in seconds",
  labelNames: ["method", "route", "status_code"],
  //   buckets: [0.1, 0.3, 0.5, 0.7, 1, 1.5, 2, 5],
});

export const databaseResponseTimeHistogram = new client.Histogram({
  name: "database_response_time_duration_seconds",
  help: "Database response time in seconds",
  labelNames: ["operation", "success"],
  //   buckets: [0.01, 0.03, 0.05, 0.1, 0.3, 0.5, 1],
});

export function startMetricsServer(port: number) {
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics({ prefix: "my_app_" });
  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  });
  app.listen(port, () => {
    logger.info(`Metrics server listening on port ${port}`);
  });
}
