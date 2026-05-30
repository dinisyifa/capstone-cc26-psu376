import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Prediction = sequelize.define(
  "Prediction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "user_id",
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    gender: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    coffeeIntake: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "coffee_intake",
    },

    caffeineMg: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "caffeine_mg",
    },

    sleepHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "sleep_hours",
    },

    sleepQuality: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "sleep_quality",
    },

    bmi: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    heartRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "heart_rate",
    },

    physicalActivityHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "physical_activity_hours",
    },

    occupation: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    riskScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "risk_score",
    },

    riskCategory: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "risk_category",
    },

    stressLevel: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "stress_level",
    },

    stressProbability: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "stress_probability",
    },

    healthStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "health_status",
    },

    healthProbability: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "health_probability",
    },

    recommendationPreview: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "recommendation_preview",
    },

    recommendationFull: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "recommendation_full",
    },
  },
  {
    tableName: "predictions",
    timestamps: true,
    underscored: true,
  },
);

export default Prediction;
