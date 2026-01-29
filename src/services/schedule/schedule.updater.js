import fetch from "node-fetch";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
import { ensureStorage, saveData } from "./schedule.storage.js";

const BASE_URL = "https://api-toe-poweron.inneti.net";
const API_URL = `${BASE_URL}/api/a_gpv_g`;
const GROUP = "4.1";

const STATE_MAP = {
  0: "on",
  1: "off",
  10: "transition",
};

const UPDATE_INTERVAL = 10 * 60 * 1000;

function mapTimesToSlots(times, baseDate) {
  const entries = Object.entries(times).sort(([a], [b]) => a.localeCompare(b));

  return entries.map(([time, rawState], index) => {
    const [hour, minute] = time.split(":").map(Number);

    const from = baseDate.hour(hour).minute(minute).second(0).millisecond(0);

    const to = from.add(30, "minute");

    return {
      index,
      from: from.format(),
      to: to.format(),
      state: STATE_MAP[rawState] ?? "unknown",
    };
  });
}

export async function getSchedule() {
  try {
    console.log("[schedule] updating schedule image…");

    const today = dayjs();
    const params = new URLSearchParams({
      before: today.utc().startOf("day").add(1, "day").toISOString(),
      after: today.utc().startOf("day").hour(12).subtract(1, "day").toISOString(),
      "group[]": GROUP,
    });

    const url = new URL(API_URL);
    url.search = params.toString();

    const res = await fetch(url);
    const data = await res.json();
    const json = data["hydra:member"]?.[0]?.dataJson;
    if (!json) throw new Error("Image path not found");

    const schedule = json[GROUP];
    saveData({
      updatedAt: dayjs(),
      slots: mapTimesToSlots(schedule.times, today),
    });

    console.log("[schedule] image updated");
  } catch (err) {
    console.error("[schedule] update failed:", err.message);
  }
}

export function startScheduleUpdater() {
  ensureStorage();
  getSchedule();
  setInterval(getSchedule, UPDATE_INTERVAL);
}
