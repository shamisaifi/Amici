import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./src/routes/posts.route.js";
import authRoutes from "./src/routes/auth.route.js";
const PORT = process.env.PORT || 5000;

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.use("/auth", authRoutes);

app.use("/posts", postRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error: ", err);
  });
