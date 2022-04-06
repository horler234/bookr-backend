import express from "express";
import { json } from "body-parser";
import routes from "./routes";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(json());
dotenv.config();

mongoose.connect(process.env.MONGODB_URI as string, () => {
  console.log("connected to database");
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
  console.log(process.env.MONGODB_URI);
  routes(app);
});
