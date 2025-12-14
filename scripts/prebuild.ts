/**
 * Prebuild environment guard
 * - Load dotenv ONLY in local development
 * - Never override Heroku config vars in production
 */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("[Prebuild] NODE_ENV:", process.env.NODE_ENV);
console.log(
  "[Prebuild] DATABASE_URL:",
  process.env.DATABASE_URL?.includes("localhost") ? "⚠️ localhost" : "✅ non-local"
);
