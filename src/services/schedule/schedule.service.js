import dayjs from "dayjs";
import { readData } from "./schedule.storage.js";

export async function getLightStatus() {
  const data = readData();
  const now = dayjs();
  const currentSlot = data.slots.find(
    (slot) => now.isAfter(dayjs(slot.from)) && now.isBefore(dayjs(slot.to)),
  );

  const nearestSlotWithOppositeState = data.slots.find(
    (slot, index) => index > currentSlot?.index && slot.state !== currentSlot?.state,
  );

  const messages = {
    on:
      "Світло зараз є. " +
      (nearestSlotWithOppositeState?.state === "on"
        ? ` Можливе відключення в ${dayjs(nearestSlotWithOppositeState?.from).format("HH:mm")}`
        : "Сьогодні світло не вимкнуть"),
    off:
      "Світло зараз відсутнє. " +
      (nearestSlotWithOppositeState?.state === "off"
        ? ` Мають увімкнути в ${dayjs(nearestSlotWithOppositeState?.from).format("HH:mm")}`
        : "Сьогодні світло не увімкнуть"),
    transition:
      "Зараз жовта зона, світло можуть " +
      (nearestSlotWithOppositeState?.state === "transition" ? `увімкнути` : "вимкнути") +
      ` в ${dayjs(nearestSlotWithOppositeState?.from).format("HH:mm")}`,
  };

  return {
    result: messages[currentSlot?.state],
  };
}
