import * as tf from "@tensorflow/tfjs";
import fs from "fs";
import csv from "csv-parser";

import {
  encodeGender,
  encodeSleepQuality,
  encodeOccupation,
  encodeStressLevel,
} from "./preprocess.js";

const results = [];

fs.createReadStream("src/ai/dataset/dataset_kopi_clean.csv")
  .pipe(csv())
  .on("data", (data) => {
    results.push(data);
  })
  .on("end", async () => {
    console.log(`Dataset loaded: ${results.length} rows`);

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

    console.log("Tensor created");

    const model = tf.sequential();

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

    console.log("Training started...");

    await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          console.log(
            `Epoch ${epoch + 1} | Loss: ${logs.loss.toFixed(4)} | Accuracy: ${logs.acc.toFixed(4)}`,
          );
        },
      },
    });

    console.log("Training finished");

    await model.save("file://src/ai/model");

    console.log("Model saved successfully");
  });
