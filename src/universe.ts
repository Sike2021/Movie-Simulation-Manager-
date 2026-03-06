import { Universe } from "./types";

export function createUniverse(name: string): Universe {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    franchiseIds: [],
    characterIds: [],
    continuityScore: 100,
    totalBoxOffice: 0
  };
}
