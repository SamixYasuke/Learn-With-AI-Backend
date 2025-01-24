import swaggerJsdoc, { OAS3Definition } from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const isDevelopment = process.env.ISDEVELOPMENT === "true";
const swaggerJsonUrl = isDevelopment
  ? process.env.DEV_URL
  : process.env.PROD_URL;

const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "Learn With AI Docs",
    version: "1.0.0",
    description:
      "This API provides functionalities for uploading note, chatting with ai concerning the note, see the note summary and answering questions set by the AI based on the note, built with Express and documented with Swagger.",
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
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/docs/*.ts"],
};

const specs = swaggerJsdoc(options);

export default specs;
