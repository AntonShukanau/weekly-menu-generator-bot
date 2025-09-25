import { breakfasts, dinners } from "./dishes.ts";
import { menuLocales } from "./locales.ts";

const generator = (array: string[]) => array[Math.floor(Math.random() * array.length)];

export default function createWeeklyMenu(language: "en" | "ru" | "uk" = "en"): string {
  const locale = menuLocales[language];
  const breakfastOptions = breakfasts[language];
  const dinnerOptions = dinners[language];

  const menu = locale.days.map((day) => {
    return `${day}:\n ${locale.breakfast}: ${generator(breakfastOptions)}\n ${locale.dinner}: ${generator(dinnerOptions)}\n`;
  });
  return menu.join("\n");
}