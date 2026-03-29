import fs from "fs";
import { execSync } from "child_process";

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error("Usage: bump-version.ts <major.minor.patch>");
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
packageJson.version = version;
fs.writeFileSync("package.json", `${JSON.stringify(packageJson, null, 2)}\n`);

const manifestJson = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
manifestJson.version = version;
fs.writeFileSync("manifest.json", `${JSON.stringify(manifestJson, null, 2)}\n`);

execSync("npm install", { stdio: "inherit" });

const lockfileVersion = JSON.parse(fs.readFileSync("package-lock.json", "utf8")).version;

if (lockfileVersion !== version) {
  console.error(`package-lock.json version is ${lockfileVersion}, expected ${version}`);
  process.exit(1);
}

console.log(`My Notes updated to ${version}`);
