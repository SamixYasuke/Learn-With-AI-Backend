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
    title: "BoilerPlate Express API with Swagger",
    version: "1.0.0",
    description:
      "This is a simple CRUD API application made with Express and documented with Swagger",
  },
  servers: [
    {
      url: swaggerJsonUrl,
      description: "Local server",
    },
  ],
  components: {
    schemas: {
      Squeeze: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          first_name: { type: "string" },
          last_name: { type: "string" },
          phone: { type: "string" },
          location: { type: "string" },
          job_title: { type: "string" },
          company: { type: "string" },
          interests: { type: "string" },
          referral_source: { type: "string" },
        },
        required: ["id", "email", "first_name", "last_name"],
      },
    },
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
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJsdoc(options);

export default specs;
