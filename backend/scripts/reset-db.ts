import { execSync } from "child_process";

console.log("🔄 Resetting TMBC database…");

try {
  execSync("npx prisma migrate reset --force", { stdio: "inherit" });
  console.log("✅ Database reset and reseeded.");
} catch (err) {
  console.error("❌ Failed to reset database:", err);
  process.exit(1);
}
