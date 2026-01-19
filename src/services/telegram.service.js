import TelegramBot from "node-telegram-bot-api";
import dayjs from "dayjs";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const DEFAULT_CHAT = process.env.CHAT_ID;

export const sendTelegramMessage = (message, chatId = DEFAULT_CHAT) => {
  const now = dayjs();
  const isEvening = now.hour() > 19 || (now.hour() === 19 && now.minute() >= 30) || now.hour() < 6;
  if (isEvening) return;
  bot.sendMessage(chatId, message);
};

sendTelegramMessage(`Сорі, я відходив. Зараз я знову працюю!`);
