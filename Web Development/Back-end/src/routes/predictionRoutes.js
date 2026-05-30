import express from "express";
import {
  createPrediction,
  getPredictions,
  getPredictionById,
  deletePrediction,
} from "../controllers/predictionController.js";
import { protect, optionalAuth } from "../middlewares/authMiddleware.js";
import { validatePredictionRequest } from "../validators/predictionValidator.js";

const router = express.Router();

router.post("/", optionalAuth, validatePredictionRequest, createPrediction);

router.get("/", protect, getPredictions);
router.get("/:id", protect, getPredictionById);
router.delete("/:id", protect, deletePrediction);

export default router;
