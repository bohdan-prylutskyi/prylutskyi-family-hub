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
    on: `Світло зараз є. Можливе відключення о ${dayjs(nearestSlotWithOppositeState?.from).format("HH:mm")}`,
    off: `Світло зараз відсутнє. Мають увімкнути о ${dayjs(nearestSlotWithOppositeState?.from).format("HH:mm")}`,
    transition: `Зараз жовта зона, світло можуть ${nearestSlotWithOppositeState?.state === "on" ? "увімкнути" : "вимкнути"} в ${dayjs(nearestSlotWithOppositeState?.from).format("HH:mm")}`,
  };

  return {
    result: messages[currentSlot?.state],
  };
}
