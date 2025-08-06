// scripts/generateIndexJson.js
import fs from "fs";
import path from "path";

const dataDir = path.resolve("public", "data");
const indexFile = path.join(dataDir, "index.json");

// Only include directories
const dirs = fs
  .readdirSync(dataDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

fs.writeFileSync(indexFile, JSON.stringify(dirs, null, 2));
console.log(`✅ Wrote index.json with ${dirs.length} entries.`);
