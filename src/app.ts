import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.config";
import initializeDatabaseandServer from "./data-source";
import { errorHandler } from "./errors/errorHandlers";
import { authRoute, noteRoute, examRoute } from "./routes";

const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1", noteRoute);
app.use("/api/v1", examRoute);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello, this is an API for Learn with AI 😊</h1>");
});

initializeDatabaseandServer(app);
