import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import metadataRoutes from "./routes/metadataRoutes.js";

import { successResponse } from "./utils/response.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./middlewares/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  return successResponse(res, "Coffee Health API is running");
});

app.get("/api/health", (req, res) => {
  return successResponse(res, "Server is healthy", {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/metadata", metadataRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
