import { Prediction } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { predictHealthRisk } from "../services/aiService.js";
import { transformFrontendInput } from "../utils/inputTransformer.js";

// Bikin distribusi probabilitas per kelas (untuk chart di FE)
const buildDistributions = (aiResult) => {
  const stressLabels = ["Low", "Medium", "High"];
  const healthLabels = ["No Issues", "Mild", "Moderate", "Severe"];

  const distrib = (target, prob, labels) => {
    const otherProb = (1 - prob) / (labels.length - 1);
    return labels.reduce((acc, l) => {
      acc[l] = Number((l === target ? prob : otherProb).toFixed(3));
      return acc;
    }, {});
  };

  return {
    stressDistribution: distrib(
      aiResult.stressLevel,
      aiResult.stressProbability,
      stressLabels,
    ),
    healthDistribution: distrib(
      aiResult.healthStatus,
      aiResult.healthProbability,
      healthLabels,
    ),
  };
};

export const createPrediction = asyncHandler(async (req, res) => {
  // 1. Translate payload FE → format AI
  const input = transformFrontendInput(req.body);
  const isLoggedIn = Boolean(req.user);

  // 2. Panggil AI untuk prediksi
  const aiResult = await predictHealthRisk(input);
  const dists = buildDistributions(aiResult);

  // 3. Simpan ke DB kalau user login
  let savedId = null;
  if (isLoggedIn) {
    const saved = await Prediction.create({
      userId: req.user.id,
      ...input,
      riskScore: aiResult.riskScore,
      riskCategory: aiResult.riskCategory,
      stressLevel: aiResult.stressLevel,
      stressProbability: aiResult.stressProbability,
      healthStatus: aiResult.healthStatus,
      healthProbability: aiResult.healthProbability,
      recommendationPreview: aiResult.recommendationPreview,
      recommendationFull: aiResult.recommendationFull,
    });
    savedId = saved.id;
  }

  // 4. Return response ke FE
  return successResponse(
    res,
    "Prediksi berhasil dibuat",
    {
      id: savedId,
      input,
      riskScore: aiResult.riskScore,
      riskCategory: aiResult.riskCategory,
      stressLevel: aiResult.stressLevel,
      stressProbability: aiResult.stressProbability,
      healthStatus: aiResult.healthStatus,
      healthProbability: aiResult.healthProbability,
      ...dists,
      isRecommendationLocked: !isLoggedIn,
      recommendation: isLoggedIn
        ? aiResult.recommendationFull
        : aiResult.recommendationPreview,
      ...(isLoggedIn
        ? {}
        : {
            lockMessage:
              "Login atau buat akun untuk melihat rekomendasi lengkap.",
          }),
    },
    201,
  );
});

export const getPredictions = asyncHandler(async (req, res) => {
  const { Op } = await import("sequelize");
  const { range } = req.query;

  const where = { userId: req.user.id };

  if (range) {
    const now = new Date();
    let from = new Date();
    if (range === "today") from.setHours(0, 0, 0, 0);
    else if (range === "7d") from.setDate(now.getDate() - 7);
    else if (range === "30d") from.setDate(now.getDate() - 30);
    where.createdAt = { [Op.gte]: from };
  }

  const predictions = await Prediction.findAll({
    where,
    order: [["createdAt", "DESC"]],
    limit: 100,
  });

  return successResponse(res, "Riwayat prediksi", { items: predictions });
});

export const getPredictionById = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!prediction) {
    return errorResponse(res, "Prediksi tidak ditemukan", 404);
  }

  return successResponse(res, "Detail prediksi", prediction);
});

export const deletePrediction = asyncHandler(async (req, res) => {
  const deleted = await Prediction.destroy({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!deleted) {
    return errorResponse(res, "Prediksi tidak ditemukan", 404);
  }

  return successResponse(res, "Prediksi berhasil dihapus");
});
