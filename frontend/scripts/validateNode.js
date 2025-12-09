const semver = require("semver");

const required = "18.0.0";
const current = process.version;

if (!semver.gte(current, required)) {
  console.error(`
⚠️  ERROR: Node ${required}+ is required.
You are running ${current}.
Use:

    nvm install 18
    nvm use 18

`);
  process.exit(1);
}
