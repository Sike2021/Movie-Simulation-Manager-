import { Movie, MovieStatus, Studio, TeamMember, SimulationReport, Award, Notification, ReleaseStrategy, GlobalEvent } from "./types";
import { generateAwards } from "./awards";
import { createFestival, PREDEFINED_FESTIVALS, evaluateFestival } from "./festivals";
import { updateReputation } from "./prestige";

export function createStudio(name: string): Studio {
  const rivals = [
    { id: 'r1', name: 'Apex Pictures', money: 5000000, reputation: 80, projects: [], prestige: 75 },
    { id: 'r2', name: 'Nebula Studios', money: 3000000, reputation: 65, projects: [], prestige: 60 },
    { id: 'r3', name: 'Titan Films', money: 10000000, reputation: 90, projects: [], prestige: 85 },
  ];

  return {
    name,
    money: 1000000,
    reputation: 50,
    projects: [],
    universes: [],
    franchises: [],
    characters: [],
    awards: [],
    festivals: PREDEFINED_FESTIVALS.map(f => createFestival(f.name, f.month, f.prestige)),
    currentWeek: 1,
    staff: [],
    notifications: [],
    rivals,
    valuation: 1000000,
    monthlyProfit: [],
    activeEvents: [],
    initialized: true,
  };
}

export function createMovie(
  title: string, 
  genres: string[],
  budget: number, 
  releaseWeek: number, 
  universeId?: string, 
  franchiseId?: string,
  scenes: number = 60,
  runtime: number = 120,
  castIds: string[] = [],
  crew: Record<string, string> = {}
): Movie {
  return {
    id: Math.random().toString(36).substr(2, 9),
    title,
    genres,
    budget,
    progress: 0,
    weeklyBoxOffice: [],
    boxOffice: 0,
    status: MovieStatus.PRE_PRODUCTION,
    releaseWeek,
    universeId,
    franchiseId,
    characterIds: [],
    criticScore: 50 + Math.floor(Math.random() * 50),
    marketingSpend: 0,
    audienceInterest: 50,
    scenes,
    runtime,
    castIds,
    crew,
    releaseStrategy: ReleaseStrategy.THEATRICAL,
    marketingCampaigns: [],
    totalMarketingSpend: 0,
    streamingRevenue: 0,
    theatricalRevenue: 0,
    qualityScore: 0,
    speedBonus: 0,
  };
}

const EVENT_MODIFIERS = [
  { name: "Summer Blockbuster Season", startWeek: 20, endWeek: 30, multiplier: 1.5 },
  { name: "Holiday Season", startWeek: 48, endWeek: 52, multiplier: 1.8 },
  { name: "Award Season", startWeek: 1, endWeek: 8, multiplier: 1.2 },
];

export function simulateWeek(studio: Studio): Studio {
  const nextWeek = studio.currentWeek + 1;
  let updatedStudio = { ...studio, currentWeek: nextWeek };
  const newAwards: Award[] = [];
  const newNotifications: Notification[] = [];

  // Staff impact calculation
  const staff = studio.staff || [];
  const avgStaffSkill = staff.length > 0 
    ? staff.reduce((acc, s) => acc + s.skill, 0) / staff.length 
    : 50;
  
  const progressMultiplier = 0.8 + (avgStaffSkill / 100) * 0.4; // 0.8 to 1.2

  // Event modifier
  const currentEvent = EVENT_MODIFIERS.find(e => {
    const weekInYear = ((nextWeek - 1) % 52) + 1;
    return weekInYear >= e.startWeek && weekInYear <= e.endWeek;
  });
  const eventMultiplier = currentEvent ? currentEvent.multiplier : 1.0;

  const seasonalMult = eventMultiplier;
  const globalEventMult = (updatedStudio.activeEvents || []).reduce((acc, e) => acc * e.impact, 1);

  const updatedProjects = (studio.projects || []).map((movie) => {
    // Calculate crew impact
    const movieCrew = Object.entries(movie.crew).map(([role, memberId]) => {
      return studio.staff.find(s => s.id === memberId);
    }).filter(Boolean) as TeamMember[];

    const qualityBonus = movieCrew.reduce((acc, s) => acc + s.qualityModifier, 0);
    const speedBonus = movieCrew.reduce((acc, s) => acc + s.speedModifier, 0);

    if (movie.status === MovieStatus.RELEASED) {
      const weeksSinceRelease = nextWeek - movie.releaseWeek;
      if (weeksSinceRelease > 20) return movie;

      // Revenue affected by marketing, critic score, and events
      const marketingBoost = movie.marketingCampaigns.reduce((acc, c) => acc + c.impact, 0) / 10;
      const marketingBonus = 1 + (movie.marketingSpend / movie.budget) * 0.5 + marketingBoost;
      const criticBonus = 0.5 + (movie.criticScore! / 100);
      const interestBonus = movie.audienceInterest / 50;

      const base = movie.budget * 0.15 * Math.pow(0.65, weeksSinceRelease);
      let revenue = Math.floor(base * marketingBonus * criticBonus * interestBonus * seasonalMult * globalEventMult);

      // Strategy adjustments
      if (movie.releaseStrategy === ReleaseStrategy.STREAMING) {
        revenue = Math.floor(revenue * 0.4); // Lower but more consistent
      } else if (movie.releaseStrategy === ReleaseStrategy.HYBRID) {
        revenue = Math.floor(revenue * 0.8);
      }

      if (weeksSinceRelease === 1) {
        newNotifications.push({
          id: Math.random().toString(36).substr(2, 9),
          week: nextWeek,
          message: `Opening week for ${movie.title}: ${revenue.toLocaleString()}`,
          type: "revenue"
        });
      }

      return {
        ...movie,
        weeklyBoxOffice: [...movie.weeklyBoxOffice, revenue],
        boxOffice: movie.boxOffice + revenue,
        theatricalRevenue: movie.releaseStrategy !== ReleaseStrategy.STREAMING ? movie.theatricalRevenue + revenue : movie.theatricalRevenue,
        streamingRevenue: movie.releaseStrategy !== ReleaseStrategy.THEATRICAL ? movie.streamingRevenue + revenue : movie.streamingRevenue,
      };
    }
    
    // Production phases
    const progressInc = 1 * progressMultiplier * (1 + speedBonus);
    
    // Genre synergy bonus
    const genreSynergy = movie.genres.length > 1 ? 0.05 * (movie.genres.length - 1) : 0;
    const qualityInc = (qualityBonus + genreSynergy) / 10; // Slow quality build
      const newProgress = movie.progress + progressInc;
      if (newProgress >= 4) {
        newNotifications.push({
          id: Math.random().toString(36).substr(2, 9),
          week: nextWeek,
          message: `${movie.title} has entered Filming!`,
          type: "milestone"
        });
        return { ...movie, status: MovieStatus.FILMING, progress: 0 };
      }
      return { ...movie, progress: newProgress };
    }

    if (movie.status === MovieStatus.FILMING) {
      const newProgress = movie.progress + progressInc;
      if (newProgress >= 8) {
        newNotifications.push({
          id: Math.random().toString(36).substr(2, 9),
          week: nextWeek,
          message: `${movie.title} has entered Post-Production!`,
          type: "milestone"
        });
        return { ...movie, status: MovieStatus.POST_PRODUCTION, progress: 0 };
      }
      return { ...movie, progress: newProgress };
    }

    if (movie.status === MovieStatus.POST_PRODUCTION) {
      const newProgress = movie.progress + progressInc;
      if (newProgress >= 4) {
        newNotifications.push({
          id: Math.random().toString(36).substr(2, 9),
          week: nextWeek,
          message: `${movie.title} is Completed!`,
          type: "milestone"
        });
        return { ...movie, status: MovieStatus.COMPLETED, progress: 0 };
      }
      return { ...movie, progress: newProgress };
    }

    if (movie.status === MovieStatus.COMPLETED && nextWeek >= movie.releaseWeek) {
        return { ...movie, status: MovieStatus.RELEASED };
    }

    return movie;
  });

  const weeklyRevenue = updatedProjects.reduce((acc, movie) => {
      if (movie.status === MovieStatus.RELEASED) {
          const lastRevenue = movie.weeklyBoxOffice[movie.weeklyBoxOffice.length - 1] || 0;
          return acc + lastRevenue;
      }
      return acc;
  }, 0);

  // Rival Studio Simulation
  const updatedRivals = (studio.rivals || []).map(rival => {
    let rivalMoney = rival.money;
    let rivalPrestige = rival.prestige;
    
    // Randomly "release" movies and earn money
    if (Math.random() > 0.8) {
      const earnings = 500000 + Math.random() * 2000000;
      rivalMoney += earnings;
      rivalPrestige += Math.random() * 2;
    }

    return { ...rival, money: rivalMoney, prestige: rivalPrestige };
  });

  updatedStudio.rivals = updatedRivals;
  updatedStudio.projects = updatedProjects;
  updatedStudio.money += weeklyRevenue;

  // Random Global Events
  if (Math.random() > 0.95) {
    const events: GlobalEvent[] = [
      { id: 'e1', name: 'Global Tech Boom', description: 'Streaming interest is up!', type: 'Boom', impact: 1.5, duration: 4, startWeek: nextWeek },
      { id: 'e2', name: 'Economic Recession', description: 'Box office sales are down.', type: 'Crisis', impact: 0.6, duration: 8, startWeek: nextWeek },
      { id: 'e3', name: 'Viral Movie Challenge', description: 'Social media hype is real.', type: 'Cultural', impact: 1.3, duration: 2, startWeek: nextWeek },
    ];
    const newEvent = events[Math.floor(Math.random() * events.length)];
    updatedStudio.activeEvents.push(newEvent);
    newNotifications.push({
      id: Math.random().toString(36).substr(2, 9),
      week: nextWeek,
      message: `EVENT: ${newEvent.name}`,
      type: "info"
    });
  }

  // Cleanup expired events
  updatedStudio.activeEvents = updatedStudio.activeEvents.filter(e => nextWeek < e.startWeek + e.duration);

  // Valuation Calculation
  const totalAssets = updatedStudio.money + updatedProjects.reduce((acc, m) => acc + (m.budget * 0.5), 0);
  const reputationValue = updatedStudio.reputation * 100000;
  updatedStudio.valuation = totalAssets + reputationValue;

  // Monthly Profit Tracking
  if (nextWeek % 4 === 0) {
    updatedStudio.monthlyProfit.push(weeklyRevenue * 4); // Simplified
  }

  updatedStudio.notifications = [...updatedStudio.notifications, ...newNotifications].slice(-50);

  // Award simulation (every 52 weeks)
  if (nextWeek % 52 === 0) {
    const year = Math.floor(nextWeek / 52);
    const yearlyAwards = generateAwards(updatedProjects, year);
    updatedStudio.awards = [...updatedStudio.awards, ...yearlyAwards];
    updatedStudio = updateReputation(updatedStudio, yearlyAwards.length * 10);
  }

  // Festival simulation
  const currentFestival = (studio.festivals || []).find(f => f.week === nextWeek);
  if (currentFestival) {
    const eligibleForFestival = updatedProjects.filter(p => 
      p.status === MovieStatus.RELEASED || 
      (p.status === MovieStatus.POST_PRODUCTION && Math.abs(p.releaseWeek - nextWeek) < 8)
    );

    eligibleForFestival.forEach(project => {
      const score = evaluateFestival(project, currentFestival);
      project.festivalScore = score;

      if (score > 160) {
        updatedStudio = updateReputation(updatedStudio, 30);
        const award: Award = {
          id: Math.random().toString(36).substr(2, 9),
          name: `${currentFestival.name} Grand Prize`,
          year: Math.floor(nextWeek / 52) + 1,
          movieId: project.id,
          category: "Best Film",
          type: "Festival"
        };
        updatedStudio.awards.push(award);
        updatedStudio.notifications.push({
          id: Math.random().toString(36).substr(2, 9),
          week: nextWeek,
          message: `${project.title} won the Grand Prize at ${currentFestival.name}!`,
          type: "award"
        });
      }
    });
  }

  if (nextWeek % 52 === 0) {
      updatedStudio.festivals = PREDEFINED_FESTIVALS.map(f => createFestival(f.name, f.month, f.prestige));
      updatedStudio.festivals = updatedStudio.festivals.map(f => ({ ...f, week: f.week + nextWeek }));
  }

  return updatedStudio;
}

export function simulateWeeks(studio: Studio, weeks: number): { studio: Studio, report: SimulationReport } {
  let currentStudio = studio;
  const initialMoney = studio.money;
  const initialProjects = JSON.parse(JSON.stringify(studio.projects));
  const initialAwardsCount = studio.awards.length;
  
  for (let i = 0; i < weeks; i++) {
    currentStudio = simulateWeek(currentStudio);
  }

  const report: SimulationReport = {
    weeksSimulated: weeks,
    totalRevenue: currentStudio.money - initialMoney,
    milestones: currentStudio.notifications
      .filter(n => n.week > studio.currentWeek && n.type === "milestone")
      .map(n => n.message),
    awardsWon: currentStudio.awards.slice(initialAwardsCount),
    projectProgress: currentStudio.projects.map((p, idx) => {
      const initial = initialProjects.find((ip: any) => ip.id === p.id);
      return {
        title: p.title,
        startStatus: initial ? initial.status : p.status,
        endStatus: p.status,
        progressGained: initial ? (p.status === initial.status ? p.progress - initial.progress : 100) : 0
      };
    })
  };

  return { studio: currentStudio, report };
}
