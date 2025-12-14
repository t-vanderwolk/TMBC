/**
 * Prebuild environment guard
 * - Load dotenv ONLY if available AND not in production
 * - Never crash if dotenv is missing
 * - Never override Heroku config vars
 */

if (process.env.NODE_ENV !== "production") {
  try {
    // Optional dependency — safe if missing
    require("dotenv").config();
    console.log("[Prebuild] dotenv loaded");
  } catch {
    console.log("[Prebuild] dotenv not installed, skipping");
  }
}

console.log("[Prebuild] NODE_ENV:", process.env.NODE_ENV);
console.log(
  "[Prebuild] DATABASE_URL:",
  process.env.DATABASE_URL?.includes("localhost") ? "⚠️ localhost" : "✅ non-local"
);
