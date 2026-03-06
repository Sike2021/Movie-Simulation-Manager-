import { Franchise } from "./types";

export function createFranchise(name: string, universeId: string): Franchise {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    universeId,
    projectIds: [],
    characterIds: [],
    fanBase: 0,
    hype: 0
  };
}
