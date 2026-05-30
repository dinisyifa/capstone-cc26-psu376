import { successResponse } from "../utils/response.js";

export const getMetadata = (req, res) => {
  const metadata = {
    genderOptions: ["Male", "Female"],

    countryOptions: [
      "Indonesia",
      "USA",
      "UK",
      "Canada",
      "Germany",
      "Japan",
      "India",
      "Australia",
      "Brazil",
      "Other",
    ],

    sleepQualityOptions: ["Poor", "Fair", "Good", "Excellent"],

    occupationOptions: [
      "Student",
      "Office Worker",
      "Healthcare Worker",
      "Teacher",
      "Engineer",
      "Entrepreneur",
      "Unemployed",
      "Other",
    ],

    inputRanges: {
      age: {
        min: 10,
        max: 100,
        label: "Age",
      },
      coffeeIntake: {
        min: 0,
        max: 15,
        label: "Coffee Intake per Day",
      },
      caffeineMg: {
        min: 0,
        max: 1200,
        label: "Caffeine Intake (mg)",
      },
      sleepHours: {
        min: 0,
        max: 24,
        label: "Sleep Hours",
      },
      bmi: {
        min: 10,
        max: 60,
        label: "BMI",
      },
      heartRate: {
        min: 40,
        max: 180,
        label: "Heart Rate",
      },
      physicalActivityHours: {
        min: 0,
        max: 24,
        label: "Physical Activity Hours",
      },
    },
  };

  return successResponse(res, "Metadata form berhasil diambil", metadata);
};
