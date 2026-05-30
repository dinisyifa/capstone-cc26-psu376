import express from "express";
import { getMetadata } from "../controllers/metadataController.js";

const router = express.Router();

router.get("/", getMetadata);

export default router;
