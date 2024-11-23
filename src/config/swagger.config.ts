import swaggerJsdoc, { OAS3Definition } from "swagger-jsdoc";
import dotenv from "dotenv";
import schemas from "../models/swagger.models";

dotenv.config();

const isDevelopment = process.env.ISDEVELOPMENT === "true";
const swaggerJsonUrl = isDevelopment
  ? process.env.DEV_URL
  : process.env.PROD_URL;

const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "Finance Management API Docs",
    version: "1.0.0",
    description:
      "This API provides functionalities for managing financial resources, including expenses, goals, incomes, and categories, built with Express and documented with Swagger.",
  },
  servers: [
    {
      url: swaggerJsonUrl,
      description: isDevelopment ? "Local Server" : "Production Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas,
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJsdoc(options);

export default specs;
