import mongoose from "mongoose";
import dotenv from "dotenv";
import { Application } from "express";
import ngrok from "ngrok";

dotenv.config();

const PORT = process.env.PORT || 3000;
const is_development = process.env.ISDEVELOPMENT;

const initializeDatabaseAndServer = async (app: Application): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    app.listen(PORT, async () => {
      if (is_development === "true") {
        (async () => {
          try {
            const url = await ngrok.connect(Number(PORT));
            console.log(`ngrok tunnel is live at: ${url}`);
          } catch (error) {
            console.error("Error starting ngrok:", error);
          }
        })();
      }
      console.log(`App is running on port ${PORT}`);
      console.log(`Database has connected successfully`);
    });
  } catch (error) {
    console.error(`Error connecting to the server: ${error}`);
    process.exit(1);
  }
};

export default initializeDatabaseAndServer;
