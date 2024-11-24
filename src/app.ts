import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.config";
import initializeDatabaseandServer from "./data-source";
import categoryRoute from "./routes/category.route";
import authRoute from "./routes/auth.route";
import goalRoute from "./routes/goal.route";
import budgetRoute from "./routes/budget.route";
import pingRoute from "./routes/ping.route";
import transactionRoute from "./routes/transaction.route";
import { errorHandler } from "./errors/errorHandlers";
import sendPingRequest from "./utils/sendPingRequest";
import cron from "node-cron";

const app = express();

app.use(express.json());
cron.schedule("*/2 * * * *", sendPingRequest);

app.use("/api/v1/auth", authRoute);
app.use("/api/v1", categoryRoute);
app.use("/api/v1", goalRoute);
app.use("/api/v1", transactionRoute);
app.use("/api/v1", budgetRoute);
app.use("/api/v1/ping", pingRoute);

app.get("/api/v1/true", (req: Request, res: Response) => {
  res.status(200).json({
    status_code: 200,
    message: true,
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorHandler);

initializeDatabaseandServer(app);
export { app };
