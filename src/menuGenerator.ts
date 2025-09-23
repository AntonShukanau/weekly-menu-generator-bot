import { breakfasts, dinners } from "./dishes.ts";

const generator = (array: Array<any>) => array[Math.floor(Math.random() * array.length)];

export default function createWeeklyMenu (): string {
  const monday = `Monday:\n Breakfast: ${generator(breakfasts)}\n Dinner: ${generator(dinners)}\n\n`;
  const tuesday = `Tuesday:\n Breakfast: ${generator(breakfasts)}\n Dinner: ${generator(dinners)}\n\n`;
  const wednesday = `Wednesday:\n Breakfast: ${generator(breakfasts)}\n Dinner: ${generator(dinners)}\n\n`;
  const thursday = `Thursday:\n Breakfast: ${generator(breakfasts)}\n Dinner: ${generator(dinners)}\n\n`;
  const friday = `Friday:\n Breakfast: ${generator(breakfasts)}\n Dinner: ${generator(dinners)}\n\n`;
  const saturday = `Saturday:\n Breakfast: ${generator(breakfasts)}\n Dinner: ${generator(dinners)}\n\n`;
  const sunday = `Sunday:\n Breakfast: ${generator(breakfasts)}\n Dinner: ${generator(dinners)}\n\n`;

  return monday + tuesday + wednesday + thursday + friday + saturday + sunday;
};