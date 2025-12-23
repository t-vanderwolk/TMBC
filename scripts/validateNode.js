const { execSync } = require("child_process");

const requiredNode = "v20.11.1";
const requiredNpm = "10.2.4";
const currentNode = process.version;
const currentNpm = execSync("npm --version", { encoding: "utf8" }).trim();

const isHomebrewNode = process.execPath.startsWith("/opt/homebrew");

if (isHomebrewNode || currentNode !== requiredNode || currentNpm !== requiredNpm) {
  console.error(`
⚠️  ERROR: TMBC requires an exact toolchain.
Node: ${requiredNode} (current: ${currentNode})
npm:  ${requiredNpm} (current: ${currentNpm})
Node path: ${process.execPath}

Fix with nvm:
  nvm install 20.11.1
  nvm use 20.11.1
  npm i -g npm@10.2.4

Then confirm:
  which node
  node -v
  which npm
  npm -v
`);
  process.exit(1);
}
