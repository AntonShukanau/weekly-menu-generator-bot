import { breakfasts, dinners } from "./dishes.ts";
import { menuLocales } from "./locales.ts";

const generator = (array: string[]) => array[Math.floor(Math.random() * array.length)];

export default function createWeeklyMenu(language: "en" | "ru" | "uk" = "en"): string {
  const locale = menuLocales[language];
  const breakfastOptions = breakfasts[language];
  const dinnerOptions = dinners[language];

  const menu = locale.days.map((day) => {
    const breakfast = generator(breakfastOptions);
    const dinner = generator(dinnerOptions);

    return `📅 ${day}:\n🍳 ${locale.breakfast}: ${breakfast}\n🍽️ ${locale.dinner}: ${dinner}`;
  });

  return `✨ ${locale.title} ✨\n\n${menu.join("\n\n")} \n\n`;
}