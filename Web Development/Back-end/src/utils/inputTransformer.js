// TERJEMAH DARI FORMAT FRONTEND KE AI BACKEND

// KAFEIN PER CANGKIR

const CAFFEINE_PER_CUP = {
  Espresso: 80,
  "Latte / Cappuccino": 63,
  "Cold Brew": 200,
  "Matcha / Teh Hijau": 70,
  default: 95,
};

// Map jenis kelamin: FE (Indonesia) → BE (English)
const GENDER_MAP = {
  "Laki-laki": "Male",
  Perempuan: "Female",
  Lainnya: "Other",
};

// Map activity level → jam olahraga per minggu
const ACTIVITY_HOURS_MAP = {
  Sedentary: 1,
  "Lightly Active": 3,
  "Very Active": 7,
  Athlete: 12,
};

// Hitung BMI dari berat (kg) & tinggi (cm)
const deriveBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm || heightCm <= 0) return 23;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

// Tentukan kualitas tidur berdasar jam tidur
const deriveSleepQuality = (hours) => {
  const h = Number(hours);
  if (h >= 7.5 && h <= 9) return "Excellent";
  if ((h >= 6.5 && h < 7.5) || (h > 9 && h <= 10)) return "Good";
  if (h >= 5.5 && h < 6.5) return "Fair";
  return "Poor";
};

// Hitung total kafein harian
const deriveCaffeineMg = (dailyCups, coffeeType) => {
  const perCup = CAFFEINE_PER_CUP[coffeeType] ?? CAFFEINE_PER_CUP.default;
  return Math.round(Number(dailyCups) * perCup);
};

/**
 * Translate payload dari frontend ke format yang dimengerti AI service
 */
export const transformFrontendInput = (body) => {
  const {
    age,
    weight,
    height,
    sex,
    country,
    dailyCups,
    coffeeType,
    sleepHours,
    activityLevel,
    occupation,
    heartRate,
  } = body;

  return {
    age: Number(age),
    gender: GENDER_MAP[sex] ?? "Other",
    country: country || "Indonesia",
    coffeeIntake: Number(dailyCups),
    caffeineMg: deriveCaffeineMg(dailyCups, coffeeType),
    sleepHours: Number(sleepHours),
    sleepQuality: deriveSleepQuality(sleepHours),
    bmi: deriveBMI(Number(weight), Number(height)),
    heartRate: heartRate != null ? Number(heartRate) : 75,
    physicalActivityHours: ACTIVITY_HOURS_MAP[activityLevel] ?? 2,
    occupation: occupation || "Other",
  };
};
