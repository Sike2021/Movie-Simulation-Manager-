import { Award, Movie, MovieStatus } from "./types";

export function isEligible(movie: Movie): boolean {
  // Eligibility rules: critic score > 70 or box office > threshold
  const criticScore = movie.criticScore || 0;
  const boxOffice = movie.boxOffice || 0;
  return movie.status === MovieStatus.RELEASED && (criticScore > 70 || boxOffice > 100000);
}

export function generateAwards(movies: Movie[], year: number): Award[] {
  const eligibleMovies = movies.filter(isEligible);
  if (eligibleMovies.length === 0) return [];

  const awards: Award[] = [];
  
  // Oscars
  const oscarCategories = ["Best Movie", "Best Director", "Best Actor"];
  oscarCategories.forEach(category => {
    const winner = eligibleMovies[Math.floor(Math.random() * eligibleMovies.length)];
    awards.push({
      id: Math.random().toString(36).substr(2, 9),
      name: `Oscar: ${category} ${year}`,
      year,
      movieId: winner.id,
      category,
      type: "Oscar"
    });
  });

  // Emmys (for TV shows, but let's assume some movies are eligible for TV awards in this sim)
  const emmyCategories = ["Best Show", "Best Actor TV"];
  emmyCategories.forEach(category => {
    const winner = eligibleMovies[Math.floor(Math.random() * eligibleMovies.length)];
    awards.push({
      id: Math.random().toString(36).substr(2, 9),
      name: `Emmy: ${category} ${year}`,
      year,
      movieId: winner.id,
      category,
      type: "Emmy"
    });
  });

  return awards;
}
