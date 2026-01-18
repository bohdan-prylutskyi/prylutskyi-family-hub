import fs from "fs";
import dayjs from "dayjs";
import { IMAGE_PATH, readData } from "./elevator.storage.js";

export async function getElevatorStatus() {
  if (!fs.existsSync(IMAGE_PATH)) {
    return {
      state: "unknown",
      safeToUseElevator: false,
      updatedAt: null,
    };
  }

  const data = readData();
  const now = dayjs();
  const currentSlot = data.slots.find(
    (slot) => now.isAfter(dayjs(slot.from)) && now.isBefore(dayjs(slot.to)),
  );

  return {
    state: currentSlot?.state ?? "unknown",
    safeToUseElevator: currentSlot?.state === "on",
    updatedAt: dayjs(data?.updatedAt).format("DD.MM.YYYY HH:mm:ss") ?? null,
  };
}
