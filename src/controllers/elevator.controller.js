import { getElevatorStatus } from "../services/elevator/elevator.service.js";

export async function status(req, res) {
  try {
    const result = await getElevatorStatus();
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get elevator status" });
  }
}
