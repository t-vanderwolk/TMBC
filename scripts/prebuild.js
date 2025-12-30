/**
 * Prebuild environment guard
 * - Load dotenv ONLY if available AND not in production
 * - Never crash if dotenv is missing
 * - Never override Heroku config vars
 */

const { execSync } = require("node:child_process");
const { existsSync } = require("node:fs");
const path = require("node:path");

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

const prismaBinary = path.join(process.cwd(), "node_modules", ".bin", "prisma");
if (existsSync(prismaBinary)) {
  console.log("[Prebuild] prisma generate");
  execSync(`${prismaBinary} generate`, { stdio: "inherit" });
} else {
  console.log("[Prebuild] prisma CLI missing, skipping generate");
}
