import { errorResponse } from "../utils/response.js";

const VALID_SEX = ["Laki-laki", "Perempuan", "Lainnya"];
const VALID_COFFEE_TYPES = [
  "Espresso",
  "Latte / Cappuccino",
  "Cold Brew",
  "Matcha / Teh Hijau",
];
const VALID_ACTIVITY = [
  "Sedentary",
  "Lightly Active",
  "Very Active",
  "Athlete",
];

export const validatePredictionRequest = (req, res, next) => {
  const {
    age,
    weight,
    height,
    sex,
    dailyCups,
    coffeeType,
    sleepHours,
    activityLevel,
  } = req.body;

  const errors = [];

  const ageNum = Number(age);
  if (!ageNum || ageNum < 12 || ageNum > 90) errors.push("age harus 12-90");

  const weightNum = Number(weight);
  if (!weightNum || weightNum < 30 || weightNum > 200)
    errors.push("weight harus 30-200 kg");

  const heightNum = Number(height);
  if (!heightNum || heightNum < 100 || heightNum > 230)
    errors.push("height harus 100-230 cm");

  if (!VALID_SEX.includes(sex)) {
    errors.push(`sex harus salah satu: ${VALID_SEX.join(", ")}`);
  }

  const cupsNum = Number(dailyCups);
  if (Number.isNaN(cupsNum) || cupsNum < 0 || cupsNum > 15) {
    errors.push("dailyCups harus 0-15");
  }

  if (!VALID_COFFEE_TYPES.includes(coffeeType)) {
    errors.push(
      `coffeeType harus salah satu: ${VALID_COFFEE_TYPES.join(", ")}`,
    );
  }

  const sleepNum = Number(sleepHours);
  if (Number.isNaN(sleepNum) || sleepNum < 0 || sleepNum > 14) {
    errors.push("sleepHours harus 0-14");
  }

  if (!VALID_ACTIVITY.includes(activityLevel)) {
    errors.push(`activityLevel harus salah satu: ${VALID_ACTIVITY.join(", ")}`);
  }

  if (errors.length > 0) {
    return errorResponse(res, "Validasi gagal", 400, { errors });
  }

  next();
};
