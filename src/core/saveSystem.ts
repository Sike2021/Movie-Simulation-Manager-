import { player } from "./player";

export function saveGame() {
  localStorage.setItem("movieSimPlayer", JSON.stringify(player));
}

export function loadGame() {
  const data = localStorage.getItem("movieSimPlayer");

  if (data) {
    Object.assign(player, JSON.parse(data));
  }
}
