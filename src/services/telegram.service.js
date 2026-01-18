import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const DEFAULT_CHAT = process.env.CHAT_ID;

bot.sendMessage(DEFAULT_CHAT, `Сорі, я відходив. Зараз я знову працюю!`);

export const sendTelegramMessage = (message, chatId = DEFAULT_CHAT) => {
  bot.sendMessage(chatId, message);
};
