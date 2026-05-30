import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "coffee_health_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  },
);

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
    process.exit(1);
  }
};

export default sequelize;
