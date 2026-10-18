import { readdirSync, readFileSync } from "node:fs";

const NODE24_MINIMUM_MAJOR = {
  "actions/checkout": 5,
  "actions/setup-node": 5,
};

const WORKFLOWS_DIR = new URL("../.github/workflows/", import.meta.url);
const files = readdirSync(WORKFLOWS_DIR).filter((file) => /\.ya?ml$/.test(file));

const failures = [];

for (const file of files) {
  const content = readFileSync(new URL(file, WORKFLOWS_DIR), "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    const match = line.match(/^\s*(?:-\s*)?uses:\s*([^\s#]+)/);
    if (!match) {
      return;
    }

    const ref = match[1];
    const atIndex = ref.lastIndexOf("@");
    if (ref.startsWith("./") || atIndex === -1) {
      return;
    }

    const action = ref.slice(0, atIndex);
    const version = ref.slice(atIndex + 1);
    const minimum = NODE24_MINIMUM_MAJOR[action];
    if (minimum === undefined) {
      return;
    }

    const major = Number.parseInt(version.replace(/^v/, ""), 10);
    if (Number.isNaN(major) || major < minimum) {
      failures.push(
        `${file}:${index + 1} ${ref} must be >= v${minimum} to run on Node.js 24`,
      );
    }
  });

  if (!/FORCE_JAVASCRIPT_ACTIONS_TO_NODE24:\s*true/.test(content)) {
    failures.push(`${file} must set "FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true"`);
  }
}

if (failures.length > 0) {
  console.error("Workflow action runtime check failed:");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log("Workflow action runtime check passed.");
