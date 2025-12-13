import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { runSelfHealingSeed } from "./utils/selfHealingSeed";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const corsOptions = {
  origin: frontendUrl,
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => res.send("TMBC backend running"));

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await runSelfHealingSeed();
    app.listen(PORT, () => {
      console.log(`TMBC backend running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Fatal backend startup error:");
    console.error(err);
    process.exit(1);
  }
}

startServer();
