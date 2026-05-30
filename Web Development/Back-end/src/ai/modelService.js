import * as tf from "@tensorflow/tfjs";
import fs from "fs";
import csv from "csv-parser";

import {
  encodeGender,
  encodeSleepQuality,
  encodeOccupation,
  encodeStressLevel,
} from "./preprocess.js";

let model = null;

export const trainAIModel = async () => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream("src/ai/dataset/dataset_kopi_clean.csv")
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {
          const features = [];
          const labels = [];

          results.forEach((row) => {
            const feature = [
              Number(row.Age),
              encodeGender(row.Gender),
              Number(row.Coffee_Intake),
              Number(row.Caffeine_mg),
              Number(row.Sleep_Hours),
              encodeSleepQuality(row.Sleep_Quality),
              Number(row.BMI),
              Number(row.Heart_Rate),
              Number(row.Physical_Activity_Hours),
              encodeOccupation(row.Occupation),
            ];

            const label = encodeStressLevel(row.Stress_Level);

            features.push(feature);
            labels.push(label);
          });

          const xs = tf.tensor2d(features);

          const ys = tf.oneHot(tf.tensor1d(labels, "int32"), 3);

          model = tf.sequential();

          model.add(
            tf.layers.dense({
              inputShape: [10],
              units: 32,
              activation: "relu",
            }),
          );

          model.add(
            tf.layers.dense({
              units: 16,
              activation: "relu",
            }),
          );

          model.add(
            tf.layers.dense({
              units: 3,
              activation: "softmax",
            }),
          );

          model.compile({
            optimizer: "adam",
            loss: "categoricalCrossentropy",
            metrics: ["accuracy"],
          });

          console.log("Training AI model...");

          await model.fit(xs, ys, {
            epochs: 30,
            batchSize: 32,
          });

          console.log("AI model trained successfully");

          resolve();
        } catch (error) {
          reject(error);
        }
      });
  });
};

export const predictStressLevel = async (input) => {
  if (!model) {
    throw new Error("AI model belum siap");
  }

  const tensor = tf.tensor2d([
    [
      Number(input.age),
      encodeGender(input.gender),
      Number(input.coffeeIntake),
      Number(input.caffeineMg),
      Number(input.sleepHours),
      encodeSleepQuality(input.sleepQuality),
      Number(input.bmi),
      Number(input.heartRate),
      Number(input.physicalActivityHours),
      encodeOccupation(input.occupation),
    ],
  ]);

  const prediction = model.predict(tensor);

  const result = await prediction.data();

  const highestProbability = Math.max(...result);

  const predictedIndex = result.indexOf(highestProbability);

  const labels = ["Low", "Medium", "High"];

  return {
    stressLevel: labels[predictedIndex],
    probabilities: {
      low: result[0],
      medium: result[1],
      high: result[2],
    },
  };
};
export const predictStress = async (data) => {
  const tensor = tf.tensor2d([
    [
      Number(data.age),
      encodeGender(data.gender),
      Number(data.coffeeIntake),
      Number(data.caffeineMg),
      Number(data.sleepHours),
      encodeSleepQuality(data.sleepQuality),
      Number(data.bmi),
      Number(data.heartRate),
      Number(data.physicalActivityHours),
      encodeOccupation(data.occupation),
    ],
  ]);

  const prediction = model.predict(tensor);

  const result = await prediction.data();

  const labels = ["Low", "Medium", "High"];

  const highest = Math.max(...result);

  const index = result.indexOf(highest);

  return {
    stressLevel: labels[index],
    confidence: highest,
  };
};
