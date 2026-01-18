import fetch from "node-fetch";
import fs from "fs";
import dayjs from "dayjs";
import { IMAGE_PATH, ensureStorage, saveData } from "./elevator.storage.js";
import { parseOutageSchedule } from "./elevator.parser.js";

const BASE_URL = "https://api-toe-poweron.inneti.net";
const API_URL = `${BASE_URL}/api/options?option_key=pw_gpv_image_today`;

const UPDATE_INTERVAL = 10 * 60 * 1000; // 10 хв

async function updateImage() {
  try {
    console.log("[elevator] updating schedule image…");

    const res = await fetch(API_URL);
    const data = await res.json();

    const imagePath = data["hydra:member"]?.[0]?.value;
    if (!imagePath) throw new Error("Image path not found");

    const imageUrl = BASE_URL + imagePath;

    const imgRes = await fetch(imageUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    fs.writeFileSync(IMAGE_PATH, buffer);
    const parsedData = await parseOutageSchedule(IMAGE_PATH, { rowLabel: "4.1" });
    saveData({
      updatedAt: dayjs(),
      slots: parsedData,
    });

    console.log("[elevator] image updated");
  } catch (err) {
    console.error("[elevator] update failed:", err.message);
  }
}

export function startElevatorUpdater() {
  ensureStorage();
  updateImage(); // одразу при старті
  setInterval(updateImage, UPDATE_INTERVAL);
}
