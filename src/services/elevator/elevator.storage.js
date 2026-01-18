import path from "path";
import fs from "fs";

const BASE_DIR = path.resolve("data/elevator");

export const IMAGE_PATH = path.join(BASE_DIR, "schedule.png");
export const DATA_PATH = path.join(BASE_DIR, "data.json");

export function ensureStorage() {
  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
  }
}

export function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function readData() {
  if (!fs.existsSync(DATA_PATH)) return null;
  return JSON.parse(fs.readFileSync(DATA_PATH));
}
