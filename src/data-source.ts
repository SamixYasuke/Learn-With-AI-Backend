// import "reflect-metadata";
// import { DataSource } from "typeorm";
// import { Squeeze } from "./models/sqeeze.model";
// import dotenv from "dotenv";

// dotenv.config();

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities: [Squeeze],
//   synchronize: true,
//   logging: false,
// });

// export async function initializeDataSource() {
//   try {
//     if (!AppDataSource.isInitialized) {
//       await AppDataSource.initialize();
//       console.log("Database connected successfully!");
//     }
//     return AppDataSource;
//   } catch (error) {
//     console.error("Database connection failed:", error);
//     process.exit(1);
//   }
// }
