import express, { Request, Response, NextFunction } from "express";
import squeezeRoute from "./routes/sequeeze.route";
import pingRoute from "./routes/ping.route";
// import { initializeDataSource } from "./data-source";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.config";
import sendPingRequest from "./utils/sendPingRequest";
import cron from "node-cron";

const app = express();

cron.schedule("*/2 * * * *", sendPingRequest);

app.use(express.json());
app.use("/api/v1/squeeze", squeezeRoute);
app.use("/api/v1/ping", pingRoute);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ status_code: 500, message: "Internal Server Error" });
});

const startServer = async () => {
  try {
    // await initializeDataSource();
    const IS_DEVELOPMENT = process.env.ISDEVELOPMENT === "true";
    const BASE_URL = IS_DEVELOPMENT
      ? process.env.DEV_URL
      : process.env.PROD_URL;
    const PORT = IS_DEVELOPMENT ? 3000 : process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running at ${BASE_URL}`);
    });
  } catch (err) {
    console.error("Failed to start application:", err);
  }
};

startServer();

export { app };
