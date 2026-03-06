import { Festival, Movie } from "./types";

export function createFestival(name: string, month: number, prestige: number): Festival {
  // Map month to week (approximate)
  const week = (month - 1) * 4 + 1;
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    month,
    week,
    prestige,
    reputationBonus: Math.floor(prestige / 4),
  };
}

export function evaluateFestival(movie: Movie, festival: Festival): number {
  const random = Math.random() * 100;
  const score = random + festival.prestige;
  return score;
}

export const PREDEFINED_FESTIVALS = [
  { name: "Berlin", prestige: 70, month: 2 },
  { name: "Cannes", prestige: 90, month: 5 },
  { name: "Venice", prestige: 80, month: 9 },
];
