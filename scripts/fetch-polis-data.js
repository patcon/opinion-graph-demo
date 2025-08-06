#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch'; // run `npm install node-fetch` if not using Node 18+

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const POLIS_API_BASE = 'https://pol.is/api/v3';
const ENDPOINTS = {
  math: 'math/pca2',
  comments: 'comments',
  conversation: 'conversations',
};

const conversationId = process.argv[2];

if (!conversationId) {
  console.error('❌ Please provide a conversation ID.\nUsage: node fetch-polis-data.js <conversation_id>\nOR npm run fetch -- <conversation_id>');
  process.exit(1);
}

const outputDir = path.join(__dirname, 'public', 'data', conversationId);

async function fetchAndSave(name, endpoint) {
  const url = `${POLIS_API_BASE}/${endpoint}?conversation_id=${conversationId}`;
  console.log(`📡 Fetching ${name} from ${url}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${name}: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const filePath = path.join(outputDir, `${name}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Saved ${name}.json to ${filePath}`);
}

async function main() {
  try {
    await fs.mkdir(outputDir, { recursive: true });

    await fetchAndSave('math', ENDPOINTS.math);
    await fetchAndSave('comments', ENDPOINTS.comments);
    await fetchAndSave('conversation', ENDPOINTS.conversation);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
