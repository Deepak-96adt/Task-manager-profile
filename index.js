import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import userRoute from "./route/user.route.js";
import sequelize from "./model/db.config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors());

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    await sequelize.sync(); // Default: Creates tables if not exists
    console.log("All models synchronized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error.message);
  }
})();

// Routes
app.use("/user", userRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

