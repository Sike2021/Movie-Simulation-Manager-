export enum MovieStatus {
  PRE_PRODUCTION = "Pre-Production",
  FILMING = "Filming",
  POST_PRODUCTION = "Post-Production",
  COMPLETED = "Completed",
  RELEASED = "Released",
  ARCHIVED = "Archived"
}

export enum ReleaseStrategy {
  THEATRICAL = "Theatrical",
  STREAMING = "Streaming",
  HYBRID = "Hybrid"
}

export interface MarketingCampaign {
  type: "Social Media" | "TV Spots" | "Billboards" | "Press Tour" | "Viral";
  cost: number;
  impact: number; // 0-100
  weekStarted: number;
}

export interface Character {
  id: string;
  name: string;
  type: "hero" | "villain" | "sidekick";
  alignment: "Hero" | "Villain" | "Neutral";
  universeId: string;
  appearances: string[]; // Movie IDs
  relationships: { characterId: string; type: string }[];
}

export interface Franchise {
  id: string;
  name: string;
  universeId: string;
  projectIds: string[];
  characterIds: string[];
  fanBase: number;
  hype: number;
}

export interface Universe {
  id: string;
  name: string;
  franchiseIds: string[];
  characterIds: string[];
  continuityScore: number;
  totalBoxOffice: number;
}

export interface Movie {
  id: string;
  title: string;
  genres: string[];
  budget: number;
  progress: number;
  weeklyBoxOffice: number[];
  boxOffice: number;
  status: MovieStatus;
  releaseWeek: number;
  universeId?: string;
  franchiseId?: string;
  characterIds: string[];
  festivalScore?: number;
  criticScore?: number;
  marketingSpend: number;
  audienceInterest: number; // 0-100
  scenes: number;
  runtime: number;
  castIds: string[];
  crew: Record<string, string>; // Role -> TeamMember ID
  releaseStrategy: ReleaseStrategy;
  marketingCampaigns: MarketingCampaign[];
  totalMarketingSpend: number;
  streamingRevenue: number;
  theatricalRevenue: number;
  qualityScore: number;
  speedBonus: number;
}

export interface Award {
  id: string;
  name: string;
  year: number;
  movieId: string;
  category: string;
  type: "Oscar" | "Emmy" | "Festival";
}

export interface Festival {
  id: string;
  name: string;
  week: number;
  month: number;
  prestige: number;
  reputationBonus: number;
  winnerMovieId?: string;
}

export interface Player {
  name: string;
  studioName: string;
  cash: number;
  stats: {
    moviesProduced: number;
    franchisesOwned: number;
    awardsWon: number;
    totalBoxOffice: number;
  };
}

export interface GlobalEvent {
  id: string;
  name: string;
  description: string;
  type: "Economic" | "Cultural" | "Crisis" | "Boom";
  impact: number; // Multiplier for revenue or interest
  duration: number; // Weeks
  startWeek: number;
}

export interface Studio {
  name: string;
  logo?: string;
  money: number;
  reputation: number;
  projects: Movie[];
  universes: Universe[];
  franchises: Franchise[];
  characters: Character[];
  awards: Award[];
  festivals: Festival[];
  currentWeek: number;
  staff: TeamMember[];
  notifications: Notification[];
  rivals: RivalStudio[];
  valuation: number;
  monthlyProfit: number[];
  activeEvents: GlobalEvent[];
  initialized: boolean;
}

export interface RivalStudio {
  id: string;
  name: string;
  reputation: number;
  money: number;
  projects: string[]; // Recent project names
  prestige: number;
}

export interface Notification {
  id: string;
  week: number;
  message: string;
  type: "milestone" | "award" | "revenue" | "info";
}

export interface SimulationReport {
  weeksSimulated: number;
  totalRevenue: number;
  milestones: string[];
  awardsWon: Award[];
  projectProgress: {
    title: string;
    startStatus: MovieStatus;
    endStatus: MovieStatus;
    progressGained: number;
  }[];
}

export interface Actor {
  id: string;
  name: string;
  age: number;
  popularity: number;
  actingSkill: number;
  fanbase: number;
  salary: number;
  genreSpecialization: string[];
  awards: string[];
  availability: boolean;
  gender: "Male" | "Female";
}

export type StaffRole = 
  | "Director" | "Producer" | "Writer" | "Screenwriter" | "Storyboard Artist"
  | "Cinematographer" | "Editor" | "Lighting Director" | "VFX Supervisor" | "Colorist"
  | "Composer" | "Music Producer" | "Sound Designer"
  | "Casting Director" | "Costume Designer" | "Set Designer" | "Makeup Artist" | "Stunt Coordinator" | "Production Manager";

export interface TeamMember {
  id: string;
  name: string;
  role: StaffRole;
  skill: number;
  experience: number;
  popularity: number;
  salary: number;
  speedModifier: number;
  qualityModifier: number;
  availability: boolean;
  contractType: "Single" | "Multi" | "Lifetime";
  moviesRemaining?: number;
}
