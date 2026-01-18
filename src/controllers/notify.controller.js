import dayjs from "dayjs";
import { sendTelegramMessage } from "../services/telegram.service.js";
import messages from "../messages.js";
import { schedule, clear } from "../services/scheduler.service.js";

export const sleepState = async (req, res) => {
  try {
    const isSleep = req.query.sleep === "true";
    const currentTime = dayjs();

    clear("sleep");

    const messageData = isSleep
      ? messages.sleep.fellAsleep(currentTime)
      : messages.sleep.wokeUp(currentTime);

    await sendTelegramMessage(messageData.text);

    if (messageData.delayed) {
      schedule("sleep", messageData.delayed.delay, async () => {
        try {
          await sendTelegramMessage(messageData.delayed.text);
        } catch (error) {
          console.error("Error sending delayed message:", error);
        }
      });
    }

    res.send({
      success: true,
      message: "Sleep state notification sent and delayed message scheduled",
    });
  } catch (error) {
    console.error("Error handling sleep state notification:", error);
    res.status(500).send({ error: "Failed to process sleep state notification" });
  }
};

export const outdoor = async (req, res) => {
  try {
    const time = dayjs();
    clear("outdoor");
    const messageData = messages.outdoor(time);
    await sendTelegramMessage(messageData.text);
    if (messageData.delayed) {
      schedule("outdoor", messageData.delayed.delay, async () => {
        try {
          await sendTelegramMessage(messageData.delayed.text);
        } catch (error) {
          console.error("Error sending delayed message:", error);
        }
      });
    }

    res.send({ success: true, message: "Outdoor notification sent and delayed message scheduled" });
  } catch (error) {
    console.error("Error handling outdoor notification:", error);
    res.status(500).send({ error: "Failed to process outdoor notification" });
  }
};

export const location = async (req, res) => {
  try {
    const { name, place, action } = req.query;
    const time = dayjs();

    if (!name || !place || !action) {
      return res.status(400).send({ error: "Missing required parameters" });
    }

    if (!["arrived", "left"].includes(action)) {
      return res.status(400).send({ error: 'Invalid action. Use "arrived" or "left"' });
    }

    await sendTelegramMessage(messages.location[action](name, place, time).text);
    res.send({ success: true, message: "Location notification sent" });
  } catch (error) {
    console.error("Error sending location:", error);
    res.status(500).send({ error: "Failed to send location" });
  }
};

export const callMePlease = async (req, res) => {
  const name = req.query.name;
  const chatId = name === "Бодя" ? process.env.BOHDAN_CHAT_ID : process.env.YULIA_CHAT_ID;
  try {
    await sendTelegramMessage(messages.callMePlease(name).text, chatId);

    clear("callMePlease");

    if (messages.callMePlease(name).delayed) {
      schedule("callMePlease", messages.callMePlease(name).delayed.delay, async () => {
        try {
          await sendTelegramMessage(messages.callMePlease(name).delayed.text, chatId);
        } catch (error) {
          console.error("Error sending delayed message:", error);
        }
      });
    }
    res.send({ success: true, message: "Call me please notification sent" });
  } catch (error) {
    console.error("Error sending call me please notification:", error);
    res.status(500).send({ error: "Failed to send call me please notification" });
  }
};
