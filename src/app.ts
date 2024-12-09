import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.config";
import initializeDatabaseandServer from "./data-source";
import { errorHandler } from "./errors/errorHandlers";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorHandler);

initializeDatabaseandServer(app);
