import 'dotenv/config';
import TelegramBot, { Message, CallbackQuery } from 'node-telegram-bot-api';
import createWeeklyMenu from './menuGenerator.ts';
import { welcomeMessages, helpMessages, errorMessages } from './locales.ts';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is required');

const bot = new TelegramBot(token, { polling: true });

bot.setMyCommands([
  { command: '/start', description: 'Start the bot' },
  { command: '/help', description: 'Get help and commands list' },
  { command: '/menu', description: 'Generate your weekly menu' },
]);

const getUserLanguage = (msg: Message): "en" | "ru" | "uk" => {
  const languageCode = msg.from?.language_code || "en";
  console.log("Detected language code:", languageCode);
  if (languageCode.startsWith("ru")) return "ru";
  if (languageCode.startsWith("uk")) return "uk";
  return "en";
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const language = getUserLanguage(msg);

  bot.sendMessage(chatId, welcomeMessages[language], {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Generate Weekly Menu 🍴", callback_data: "generate_menu" }],
      ],
    },
  });
});

bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;
  const language = getUserLanguage(msg);

  try {
    const menu = createWeeklyMenu(language);
    bot.sendMessage(chatId, menu);
  } catch (error) {
    console.error("Error generating menu:", error);
    bot.sendMessage(chatId, errorMessages.menu[language]);
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const language = getUserLanguage(msg);

  bot.sendMessage(chatId, helpMessages[language]);
});

bot.on('callback_query', (query: CallbackQuery) => {
  const chatId = query.message?.chat.id;

  if (!query.data || !chatId) {
    bot.answerCallbackQuery(query.id, { text: "❌ Invalid action." });
    return;
  }

  if (query.data === "generate_menu") {
    const language = getUserLanguage(query.message as Message);

    try {
      const menu = createWeeklyMenu(language);
      bot.sendMessage(chatId, menu);
      bot.answerCallbackQuery(query.id, { text: "✅ Menu generated successfully!" });
    } catch (error) {
      console.error("Error generating menu:", error);
      bot.sendMessage(chatId, "❌ Error generating menu. Please try again.");
      bot.answerCallbackQuery(query.id, { text: "❌ Failed to generate menu." });
    }
  }
});

console.log("Bot is running! 🚀");