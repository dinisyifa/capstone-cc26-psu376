import axios from "axios";

const sleepQualityScoreMap = {
  Poor: 25,
  Fair: 15,
  Good: 5,
  Excellent: 0,
};

const getRiskCategory = (score) => {
  if (score < 35) return "Low";
  if (score < 70) return "Moderate";
  return "High";
};

const getStressLevel = (score) => {
  if (score < 35) return "Low";
  if (score < 70) return "Medium";
  return "High";
};

const getHealthStatus = (score) => {
  if (score < 25) return "None";
  if (score < 50) return "Mild";
  if (score < 75) return "Moderate";
  return "Severe";
};

const generateRecommendationFull = ({
  caffeineMg,
  coffeeIntake,
  sleepHours,
  sleepQuality,
  physicalActivityHours,
  riskCategory,
}) => {
  if (riskCategory === "High") {
    return `Risiko kamu tergolong tinggi. Kurangi konsumsi kopi secara bertahap, terutama jika konsumsi kafein sudah mencapai ${caffeineMg} mg per hari. Hindari kopi pada sore atau malam hari, perbaiki durasi tidur sampai mendekati 7-8 jam, dan tambahkan aktivitas fisik ringan secara rutin. Hasil ini hanya indikator awal, bukan diagnosis medis.`;
  }
  if (riskCategory === "Moderate") {
    return `Risiko kamu berada pada tingkat sedang. Konsumsi kopi sebanyak ${coffeeIntake} gelas per hari masih perlu dikontrol, apalagi jika kualitas tidur kamu ${sleepQuality}. Coba batasi konsumsi kafein setelah siang hari dan jaga aktivitas fisik minimal beberapa jam per minggu.`;
  }
  return `Risiko kamu tergolong rendah. Pola konsumsi kopi dan gaya hidup kamu relatif aman berdasarkan data yang dimasukkan. Tetap jaga kualitas tidur, minum air putih yang cukup, dan hindari konsumsi kafein berlebihan.`;
};

// Map prediksi dari AI jadi probabilitas (kalau Flask cuma return label)
const stressLevelToProb = (level) => {
  switch (level) {
    case "High":
      return 0.85;
    case "Medium":
      return 0.55;
    case "Low":
    default:
      return 0.2;
  }
};

const healthStatusToProb = (status) => {
  switch (status) {
    case "Severe":
      return 0.9;
    case "Moderate":
      return 0.65;
    case "Mild":
      return 0.4;
    case "No Issues":
    case "None":
    default:
      return 0.15;
  }
};

const fallbackPrediction = (input) => {
  const {
    coffeeIntake,
    caffeineMg,
    sleepHours,
    sleepQuality,
    bmi,
    heartRate,
    physicalActivityHours,
  } = input;

  const caffeineScore = Math.min((Number(caffeineMg) / 400) * 30, 30);
  const coffeeScore = Math.min(Number(coffeeIntake) * 4, 20);
  const sleepScore =
    Number(sleepHours) < 7 ? Math.min((7 - Number(sleepHours)) * 8, 25) : 0;
  const sleepQualityScore = sleepQualityScoreMap[sleepQuality] ?? 10;

  let bmiScore = 0;
  if (Number(bmi) < 18.5 || Number(bmi) > 24.9) bmiScore = 10;

  let heartRateScore = 0;
  if (Number(heartRate) > 90) heartRateScore = 10;

  const activityScore = Number(physicalActivityHours) < 2 ? 10 : 0;

  const riskScore = Math.min(
    Math.round(
      caffeineScore +
        coffeeScore +
        sleepScore +
        sleepQualityScore +
        bmiScore +
        heartRateScore +
        activityScore,
    ),
    100,
  );

  const riskCategory = getRiskCategory(riskScore);
  const stressLevel = getStressLevel(riskScore);
  const healthStatus = getHealthStatus(riskScore);

  return {
    riskScore,
    riskCategory,
    stressLevel,
    stressProbability: Number((riskScore / 100).toFixed(2)),
    healthStatus,
    healthProbability: Number((Math.min(riskScore + 8, 100) / 100).toFixed(2)),
    recommendationPreview: `Risiko kamu berada pada kategori ${riskCategory}. Login atau buat akun untuk melihat rekomendasi lengkap.`,
    recommendationFull: generateRecommendationFull({
      caffeineMg,
      coffeeIntake,
      sleepHours,
      sleepQuality,
      physicalActivityHours,
      riskCategory,
    }),
  };
};

const normalizeAiResponse = (aiResult, input) => {
  // Ambil stress level dari berbagai kemungkinan field name
  const stressLevel =
    aiResult.stressLevel ||
    aiResult.stress_level ||
    aiResult.predicted_stress ||
    "Medium";

  // Stress probability — kalau AI kasih, pakai itu. Kalau enggak, derive dari label
  const stressProbability = Number(
    aiResult.stressProbability ??
      aiResult.stress_probability ??
      aiResult.stress_confidence ??
      stressLevelToProb(stressLevel),
  );

  // Health status
  const healthStatus =
    aiResult.healthStatus ||
    aiResult.health_status ||
    aiResult.health_issues ||
    aiResult.predicted_health ||
    "Mild";

  // Health probability
  const healthProbability = Number(
    aiResult.healthProbability ??
      aiResult.health_probability ??
      aiResult.health_confidence ??
      healthStatusToProb(healthStatus),
  );

  // Risk score = rata-rata stress & health probability × 100
  const riskScore = Math.round(
    ((stressProbability + healthProbability) / 2) * 100,
  );
  const riskCategory = getRiskCategory(riskScore);

  return {
    riskScore,
    riskCategory,
    stressLevel,
    stressProbability,
    healthStatus,
    healthProbability,
    recommendationPreview:
      aiResult.recommendationPreview ||
      aiResult.recommendation_preview ||
      `Risiko kamu berada pada kategori ${riskCategory}. Login atau buat akun untuk melihat rekomendasi lengkap.`,
    recommendationFull:
      aiResult.recommendationFull ||
      aiResult.recommendation_full ||
      aiResult.recommendation ||
      generateRecommendationFull({ ...input, riskCategory }),
  };
};

export const predictHealthRisk = async (input) => {
  const aiServiceUrl = process.env.AI_SERVICE_URL;

  if (!aiServiceUrl) {
    console.log("⚠️  AI_SERVICE_URL not set, using fallback prediction");
    return fallbackPrediction(input);
  }

  try {
    const payloadForAi = {
      Age: input.age,
      Gender: input.gender,
      Country: input.country,
      Coffee_Intake: input.coffeeIntake,
      Caffeine_mg: input.caffeineMg,
      Sleep_Hours: input.sleepHours,
      Sleep_Quality: input.sleepQuality,
      BMI: input.bmi,
      Heart_Rate: input.heartRate,
      Physical_Activity_Hours: input.physicalActivityHours,
      Occupation: input.occupation,
    };

    console.log("🤖 Calling AI service:", aiServiceUrl);
    console.log("📤 Payload:", JSON.stringify(payloadForAi));

    const response = await axios.post(aiServiceUrl, payloadForAi, {
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true", // PENTING: skip ngrok warning page
      },
    });

    console.log("📥 AI response:", JSON.stringify(response.data));

    return normalizeAiResponse(response.data, input);
  } catch (error) {
    console.error("❌ AI service failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data));
    }
    console.log("⚠️  Falling back to rule-based prediction");
    return fallbackPrediction(input);
  }
};
