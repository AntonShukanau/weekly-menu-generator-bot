import 'dotenv/config';
import TelegramBot, { Message, CallbackQuery } from 'node-telegram-bot-api';
import createWeeklyMenu from './menuGenerator.ts';
import { welcomeMessages, helpMessages, errorMessages, successMessages, menuLocales } from './locales.ts';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is required');

const bot = new TelegramBot(token, { polling: true });

bot.setMyCommands([
  { command: '/start', description: 'Start the bot' },
  { command: '/help', description: 'Get help and commands list' },
  { command: '/menu', description: 'Generate your weekly menu' },
]);

const userLanguages = new Map<number, "en" | "ru" | "uk">();

const getUserLanguage = (msgOrChatId: Message | number): "en" | "ru" | "uk" => {
  const chatId = typeof msgOrChatId === 'number' ? msgOrChatId : msgOrChatId.chat.id;

  if (userLanguages.has(chatId)) {
    return userLanguages.get(chatId)!;
  }

  const msg = typeof msgOrChatId === 'number' ? null : msgOrChatId;
  const languageCode = msg?.from?.language_code || 'en';

  let language: "en" | "ru" | "uk" = 'en';
  if (languageCode.startsWith('ru')) language = 'ru';
  if (languageCode.startsWith('uk')) language = 'uk';

  userLanguages.set(chatId, language);
  console.log(`Saved language for user ${chatId}: ${language}`);
  return language;
};

const handleError = (chatId: number, language: "en" | "ru" | "uk", errorType: keyof typeof errorMessages) => {
  bot.sendMessage(chatId, errorMessages[errorType][language]);
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const language = getUserLanguage(msg);
  console.log(language)

  bot.sendMessage(chatId, welcomeMessages[language], {
    reply_markup: {
      inline_keyboard: [
        [{ text: menuLocales[language].button, callback_data: "generate_menu" }],
      ],
    },
  });
});

bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;
  const language = getUserLanguage(chatId);

  try {
    const menu = createWeeklyMenu(language);
    bot.sendMessage(chatId, menu);
  } catch (error) {
    console.error("Error generating menu:", error);
    handleError(chatId, language, "menu");
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const language = getUserLanguage(chatId);

  bot.sendMessage(chatId, helpMessages[language]);
});

bot.on('callback_query', (query: CallbackQuery) => {
  const chatId = query.message?.chat.id!;
  const language = getUserLanguage(chatId);

  if (!query.data) {
    bot.answerCallbackQuery(query.id, { text: errorMessages.global[language] });
    return;
  }

  if (query.data === "generate_menu") {
    try {
      const menu = createWeeklyMenu(language);
      bot.sendMessage(chatId, menu);
      bot.answerCallbackQuery(query.id, { text: successMessages.tooltip[language] });
    } catch (error) {
      console.error("Error generating menu:", error);
      handleError(chatId, language, "menu");
      bot.answerCallbackQuery(query.id, { text: errorMessages.tooltip[language] });
    }
  } else {
    bot.answerCallbackQuery(query.id, { text: errorMessages.global[language] });
  }
});

console.log("Bot is running! 🚀");