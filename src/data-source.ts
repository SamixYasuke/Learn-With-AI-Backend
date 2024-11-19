import mongoose from "mongoose";
import dotenv from "dotenv";
import { Application } from "express";

dotenv.config();

const initializeDatabaseAndServer = async (app: Application): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    app.listen(process.env.PORT, () => {
      console.log(`App is running on port ${process.env.PORT} `);
      console.log(`Database has connected successfully`);
    });
  } catch (error) {
    console.error(`Error connecting to the server: ${error}`);
    process.exit(1);
  }
};

export default initializeDatabaseAndServer;
