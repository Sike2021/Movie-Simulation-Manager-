import React from "react";
import { Trophy, Star, Medal, Calendar, Award as AwardIcon } from "lucide-react";
import { Studio, Award } from "../types";

interface AwardsDashboardProps {
  studio: Studio;
}

export const AwardsDashboard: React.FC<AwardsDashboardProps> = ({ studio }) => {
  const awards = studio.awards || [];
  const recentAwards = [...awards].reverse().slice(0, 10);
  const projects = studio.projects || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-white">Studio Prestige</h3>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{studio.reputation}</div>
          <p className="text-sm text-amber-500/60">Global Industry Ranking</p>
          <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-1000" 
              style={{ width: `${Math.min(studio.reputation, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Star className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Total Awards</h3>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{awards.length}</div>
          <p className="text-sm text-white/40">Lifetime Achievements</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Medal className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Festivals</h3>
          </div>
          <div className="text-4xl font-bold text-white mb-1">
            {awards.filter(a => a.type === "Festival").length}
          </div>
          <p className="text-sm text-white/40">International Recognition</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <AwardIcon className="w-5 h-5 text-indigo-400" />
            Hall of Fame
          </h3>
          <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Recent Wins</span>
        </div>
        
        <div className="divide-y divide-white/5">
          {recentAwards.length > 0 ? (
            recentAwards.map((award) => {
              const movie = projects.find(p => p.id === award.movieId);
              return (
                <div key={award.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      award.type === "Oscar" ? "bg-amber-500/20" : "bg-indigo-500/20"
                    }`}>
                      <Trophy className={`w-6 h-6 ${
                        award.type === "Oscar" ? "text-amber-500" : "text-indigo-400"
                      }`} />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">{award.name}</div>
                      <div className="text-sm text-white/50">{award.category} • {movie?.title || "Unknown Project"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 font-mono">
                    <Calendar className="w-4 h-4" />
                    Year {award.year}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-white/30">
              No awards won yet. Produce high-quality films to enter the Hall of Fame.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
