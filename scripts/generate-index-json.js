// scripts/generateIndexJson.js
import fs from "fs";
import path from "path";

const dataDir = path.resolve("public", "data");
const indexFile = path.join(dataDir, "index.json");

const entries = fs
  .readdirSync(dataDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const dirPath = path.join(dataDir, entry.name);
    const convoPath = path.join(dirPath, "conversation.json");

    let topic = "Unknown topic";
    let participant_count = 0;
    let created = null;

    if (fs.existsSync(convoPath)) {
      try {
        const convo = JSON.parse(fs.readFileSync(convoPath, "utf-8"));
        topic = convo.topic ?? topic;
        participant_count = convo.participant_count ?? 0;
        created = convo.created ?? null;
      } catch (e) {
        console.warn(`⚠️ Could not parse conversation.json in ${entry.name}`);
      }
    }

    return {
      path: entry.name,
      topic,
      participant_count,
      created,
    };
  })
  .sort((a, b) => a.topic.localeCompare(b.topic)); // optional: sort alphabetically by topic

fs.writeFileSync(indexFile, JSON.stringify(entries, null, 2));
console.log(`✅ Wrote index.json with ${entries.length} entries.`);
