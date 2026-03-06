import { Franchise, Movie } from "./types";

export function addProjectToFranchise(franchise: Franchise, project: Movie): Franchise {
  return {
    ...franchise,
    projectIds: [...franchise.projectIds, project.id]
  };
}
