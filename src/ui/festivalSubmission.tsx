import React, { useState } from "react";
import { Send, Globe, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { Studio, Movie, Festival, MovieStatus } from "../types";

interface FestivalSubmissionProps {
  studio: Studio;
  onUpdate: (studio: Studio) => void;
}

export const FestivalSubmission: React.FC<FestivalSubmissionProps> = ({ studio, onUpdate }) => {
  const [selectedMovieId, setSelectedMovieId] = useState<string>("");
  const [selectedFestivalId, setSelectedFestivalId] = useState<string>("");

  const upcomingFestivals = studio.festivals
    .filter(f => f.week >= studio.currentWeek)
    .sort((a, b) => a.week - b.week)
    .slice(0, 3);

  const eligibleMovies = studio.projects.filter(p => 
    p.status === MovieStatus.COMPLETED || 
    p.status === MovieStatus.POST_PRODUCTION ||
    (p.status === MovieStatus.RELEASED && studio.currentWeek - p.releaseWeek < 12)
  );

  const handleSubmit = () => {
    if (!selectedMovieId || !selectedFestivalId) return;
    
    // In this simulation, submission is automatic if they meet the criteria
    // but we can add a "marketing spend" for festivals here
    const movie = studio.projects.find(p => p.id === selectedMovieId);
    if (movie) {
      // Just a UI feedback for now, the logic handles the actual evaluation during simulateWeek
      alert(`${movie.title} has been submitted for consideration!`);
      setSelectedMovieId("");
      setSelectedFestivalId("");
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-500/20 rounded-2xl">
          <Globe className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Festival Circuit</h2>
          <p className="text-white/50">Submit your best work to gain global prestige.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Upcoming Festivals</h3>
          <div className="space-y-4">
            {upcomingFestivals.map((fest) => (
              <div 
                key={fest.id}
                onClick={() => setSelectedFestivalId(fest.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedFestivalId === fest.id 
                    ? "bg-indigo-500/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10" 
                    : "bg-white/5 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-white">{fest.name}</h4>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-md">
                    Week {fest.week}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500" />
                    Prestige: {fest.prestige}
                  </div>
                  <div className="flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Reputation Bonus: +{fest.reputationBonus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Submit Project</h3>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-6">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase mb-2">Select Movie</label>
              <select
                value={selectedMovieId}
                onChange={(e) => setSelectedMovieId(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Choose a project...</option>
                {eligibleMovies.map(m => (
                  <option key={m.id} value={m.id}>{m.title} ({m.status})</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <p className="text-xs text-indigo-200/70 leading-relaxed">
                Submitting to high-prestige festivals requires a high critic score or unique genre appeal. 
                Winning can boost your studio reputation by up to 30 points.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedMovieId || !selectedFestivalId}
              className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-30"
            >
              <Send className="w-5 h-5" />
              Submit to Festival
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Star = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
