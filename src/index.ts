import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import createWeeklyMenu from './menuGenerator.ts';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is required');

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Welcome! Click the button below to generate your weekly menu!", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Generate Menu 🍴", callback_data: "generate_menu" }]
      ]
    }
  });
});

bot.on('callback_query', (query) => {
  const chatId: number | undefined = query.message?.chat.id;

  if (chatId && query.data === "generate_menu") {
    const menu: string = createWeeklyMenu();
    bot.sendMessage(chatId, `Here is your weekly menu:\n\n${menu}`);
  } else {
    console.error("query.message is undefined or chatId is unavailable");
  }
});

console.log("Bot is running!");