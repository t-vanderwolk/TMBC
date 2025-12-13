const { spawnSync } = require("child_process");

type Step = {
  title: string;
  command: string;
  args: string[];
};

const steps: Step[] = [
  { title: "Prisma schema validation", command: "prisma", args: ["validate"] },
  { title: "Prisma client generation", command: "prisma", args: ["generate"] },
];

function runStep(step: Step) {
  console.log(`\n⟳ ${step.title} (${step.command} ${step.args.join(" ")})`);
  const result = spawnSync(step.command, step.args, { stdio: "inherit" });

  if (result.error) {
    console.error("  ⚠️ unable to execute", step.command, result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`  ✖ ${step.title} failed with exit code ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

for (const step of steps) {
  runStep(step);
}

console.log("\n✔ Prebuild checks complete.");
