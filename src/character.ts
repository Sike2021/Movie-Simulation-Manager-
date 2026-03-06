import { Character } from "./types";

export function createCharacter(
  name: string, 
  type: "hero" | "villain" | "sidekick",
  universeId: string = ""
): Character {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    type,
    alignment: type === "hero" ? "Hero" : type === "villain" ? "Villain" : "Neutral",
    universeId,
    appearances: [],
    relationships: [],
  };
}
