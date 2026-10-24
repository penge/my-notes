import fs from "fs";
import { execSync } from "child_process";

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error("Usage: set-version.ts <major.minor.patch>");
  process.exit(1);
}

execSync(`npm version ${version} --no-git-tag-version`, { stdio: "inherit" });

const manifestJson = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
manifestJson.version = version;
fs.writeFileSync("manifest.json", `${JSON.stringify(manifestJson, null, 2)}\n`);

console.log(`My Notes updated to ${version}`);
