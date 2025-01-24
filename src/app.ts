import cors from "cors";
import apiRouter from "./routes";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.config";
import { errorHandler } from "./errors/errorHandlers";
import setupBullBoard from "./config/bullboard.config";
import initializeDatabaseandServer from "./data-source";
import express, { Application, Request, Response } from "express";

const app: Application = express();
const serverAdapter = setupBullBoard();

app.use(express.json());
app.use(cors());

app.use("/ui", serverAdapter.getRouter());
app.use("/api/v1", apiRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorHandler);
app.get("/", (req: Request, res: Response) => {
  res.send(`
    <h1>Welcome to the Learn with AI API 😊</h1>
    <h2>Available Routes:</h2>
    <ul>
      <li><a href="/ui">UI</a>: Access the Background Jobs</li>
      <li><a href="/api-docs">API Docs</a>: View the Swagger documentation</li>
    </ul>
  `);
});

initializeDatabaseandServer(app);
