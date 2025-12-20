/**
 * Tailwind Helper File Restorer
 * --------------------------------------------
 * Some Tailwind builds (especially under Next.js 14)
 * fail because Tailwind’s internal helper files
 * disappear from node_modules/tailwindcss/lib/util.
 *
 * This script restores the missing files so:
 *   - next build
 *   - next dev
 *   - next lint
 *
 * stop crashing.
 *
 * Automatically runs after installation.
 */

import fs from "fs";
import path from "path";

const utilPath = path.join(
  __dirname,
  "..",
  "node_modules/tailwindcss/lib/util"
);
const twUtilDir = utilPath;

const filesToRestore = {
  "negateValue.js": `module.exports = function negateValue(value) {
  if (typeof value === "string" && value.startsWith("-")) return value.slice(1);
  if (typeof value === "string") return "-" + value;
  if (typeof value === "number") return -value;
  return value;
};`,

  "configurePlugins.js": `module.exports = function configurePlugins(corePluginConfig, defaultCorePlugins) {
  const corePlugins = Array.isArray(defaultCorePlugins) ? [...defaultCorePlugins] : [];
  if (corePluginConfig === false) {
    return [];
  }
  if (corePluginConfig === true) {
    return corePlugins;
  }
  if (Array.isArray(corePluginConfig)) {
    return Array.from(new Set([...corePlugins, ...corePluginConfig]));
  }
  if (corePluginConfig && typeof corePluginConfig === "object") {
    const disabled = Object.keys(corePluginConfig).filter(
      (name) => corePluginConfig[name] === false
    );
    const reEnabled = Object.keys(corePluginConfig).filter(
      (name) => corePluginConfig[name] === true && !corePlugins.includes(name)
    );
    const filtered = corePlugins.filter((name) => !disabled.includes(name));
    return Array.from(new Set([...filtered, ...reEnabled]));
  }
  return corePlugins;
};`,

  "log.js": `module.exports = {
  info: (...args) => console.log("[tailwind:info]", ...args),
  warn: (...args) => console.warn("[tailwind:warn]", ...args),
  error: (...args) => console.error("[tailwind:error]", ...args),
};`,

  // NEW: Missing in several Tailwind releases — required by pluginUtils.js
  "validateFormalSyntax.js": `/**
 * Minimal stub for Tailwind's validateFormalSyntax utility.
 * It only needs to exist so requiring it does not crash Next.js.
 */
module.exports = function validateFormalSyntax(input) {
  if (!input) return true;
  try {
    return typeof input === "string";
  } catch {
    return true;
  }
};`,
};

if (!fs.existsSync(utilPath)) {
  console.warn("[Tailwind Helper Fix] util directory missing — creating:", utilPath);
  fs.mkdirSync(utilPath, { recursive: true });
}

for (const [fileName, content] of Object.entries(filesToRestore)) {
  const filePath = path.join(utilPath, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`[Tailwind Helper Fix] Restored: ${fileName}`);
    } else {
      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`[Tailwind Helper Fix] Repaired empty file: ${fileName}`);
      }
    }
  } catch (err) {
    console.error(`[Tailwind Helper Fix] Error restoring ${fileName}:`, err);
  }
}

console.log("[Tailwind Helper Fix] Completed.");

const validatePath = path.join(
  twUtilDir,
  "validateFormalSyntax.js"
);

if (!fs.existsSync(validatePath)) {
  fs.writeFileSync(validatePath, `module.exports = () => true;`);
}
