import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.config";
import initializeDatabaseandServer from "./data-source";
import userRoute from "./routes/user.route";
import categoryRoute from "./routes/category.route";
import expenseRoute from "./routes/expense.route";
import incomeRoute from "./routes/income.route";
import { errorHandler } from "./errors/errorHandlers";

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRoute);
app.use("/api/v1", categoryRoute);
app.use("/api/v1", expenseRoute);
app.use("/api/v1", incomeRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorHandler);

initializeDatabaseandServer(app);
export { app };
