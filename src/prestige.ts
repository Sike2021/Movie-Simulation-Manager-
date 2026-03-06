import { Studio } from "./types";

export function updateReputation(studio: Studio, points: number): Studio {
  return {
    ...studio,
    reputation: Math.min(100, Math.max(0, studio.reputation + points))
  };
}
