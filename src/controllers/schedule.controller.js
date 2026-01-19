import { getLightStatus } from "../services/schedule/schedule.service.js";

export async function status(req, res) {
  try {
    const result = await getLightStatus();
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get light status" });
  }
}
