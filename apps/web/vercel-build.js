#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

const rootDir = path.join(__dirname, "../..");
const webDir = __dirname;

try {
  console.log("Installing dependencies from root...");
  execSync("pnpm install", { cwd: rootDir, stdio: "inherit" });

  console.log("Building web app...");
  execSync("pnpm build", { cwd: webDir, stdio: "inherit" });

  console.log("Build completed successfully!");
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
}
