import sequelize from "../config/database.js";
import User from "./User.js";
import Prediction from "./Prediction.js";

User.hasMany(Prediction, {
  foreignKey: "userId",
  as: "predictions",
});

Prediction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Database synchronization failed:", error.message);
    process.exit(1);
  }
};

export { User, Prediction };
