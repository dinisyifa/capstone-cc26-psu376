import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { syncDatabase } from "./models/index.js";

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  try {
    await connectDatabase();
    await syncDatabase();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📡 API base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Bootstrap error:", error);
    process.exit(1);
  }
};

bootstrap();
