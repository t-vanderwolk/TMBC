#!/usr/bin/env node

/**
 * Ensures react-native-css-interop uses SafeAreaView from react-native-safe-area-context
 * to avoid React Native deprecation warnings. This script is idempotent and runs after
 * each install via the package.json postinstall hook.
 */

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const targetPath = path.join(
  projectRoot,
  "node_modules",
  "react-native-css-interop",
  "dist",
  "runtime",
  "components.js"
);

if (!fs.existsSync(targetPath)) {
  console.warn(
    "[fix-safe-area-view] Target file not found, skipping patch:",
    targetPath
  );
  process.exit(0);
}

const original = fs.readFileSync(targetPath, "utf8");

if (original.includes("SafeAreaViewInterop")) {
  console.log("[fix-safe-area-view] Patch already applied.");
  process.exit(0);
}

const needle =
  '(0, api_1.cssInterop)(react_native_1.SafeAreaView, { className: "style" });';

if (!original.includes(needle)) {
  console.warn(
    "[fix-safe-area-view] Expected code segment not found. File format may have changed."
  );
  process.exit(0);
}

const replacement = `let SafeAreaViewInterop;
try {
    SafeAreaViewInterop = require("react-native-safe-area-context").SafeAreaView;
}
catch { }
if (!SafeAreaViewInterop) {
    try {
        SafeAreaViewInterop = require("react-native").SafeAreaView;
    }
    catch { }
}
if (SafeAreaViewInterop) {
    (0, api_1.cssInterop)(SafeAreaViewInterop, { className: "style" });
}
`;

const updated = original.replace(needle, replacement);

fs.writeFileSync(targetPath, updated);

console.log(
  "[fix-safe-area-view] Patched react-native-css-interop to prefer react-native-safe-area-context SafeAreaView."
);
