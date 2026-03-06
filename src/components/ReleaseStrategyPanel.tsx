import React from 'react';
import { motion } from 'motion/react';
import { Clapperboard, Monitor, Layers, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Studio, Movie, ReleaseStrategy } from '../types';

interface ReleaseStrategyPanelProps {
  studio: Studio;
  onUpdateStudio: (studio: Studio) => void;
}

const STRATEGIES = [
  { 
    id: ReleaseStrategy.THEATRICAL, 
    name: "Theatrical Exclusive", 
    icon: Clapperboard, 
    color: "bg-indigo-500",
    description: "Maximum revenue potential through box office sales. High prestige but high risk.",
    pros: ["High Revenue Potential", "Prestige for Awards", "Cultural Impact"],
    cons: ["High Marketing Cost", "Revenue Decay", "Vulnerable to Competition"]
  },
  { 
    id: ReleaseStrategy.STREAMING, 
    name: "Direct to Streaming", 
    icon: Monitor, 
    color: "bg-purple-500",
    description: "Lower upfront revenue but consistent long-term income. Lower risk and marketing costs.",
    pros: ["Consistent Revenue", "Lower Marketing Cost", "Instant Global Reach"],
    cons: ["Lower Prestige", "No Box Office Peak", "Limited Award Eligibility"]
  },
  { 
    id: ReleaseStrategy.HYBRID, 
    name: "Hybrid Release", 
    icon: Layers, 
    color: "bg-emerald-500",
    description: "The best of both worlds. Balanced revenue streams across theatrical and streaming.",
    pros: ["Multiple Revenue Streams", "Broad Audience Reach", "Lower Risk"],
    cons: ["Cannibalization Risk", "Complex Marketing", "Moderate Prestige"]
  }
];

export default function ReleaseStrategyPanel({ studio, onUpdateStudio }: ReleaseStrategyPanelProps) {
  const completedMovies = (studio.projects || []).filter(p => p.status === "Completed");

  const handleUpdateStrategy = (movieId: string, strategy: ReleaseStrategy) => {
    const updatedProjects = (studio.projects || []).map(p => {
      if (p.id === movieId) {
        return { ...p, releaseStrategy: strategy };
      }
      return p;
    });

    onUpdateStudio({
      ...studio,
      projects: updatedProjects
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Release Strategy</h2>
          <p className="text-white/40 mt-1">Choose how to distribute your completed projects to maximize ROI.</p>
        </div>
      </div>

      {completedMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white/5 border border-dashed border-white/10 rounded-[40px] text-white/20">
          <Clapperboard className="w-16 h-16 mb-4" />
          <p className="text-lg font-medium">No completed movies ready for release</p>
          <p className="text-sm mt-2">Finish production on a project to set its release strategy.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {completedMovies.map((movie, movieIndex) => (
            <motion.div 
              key={movie.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: movieIndex * 0.1 }}
              className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400">
                    <Film className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{movie.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/40">
                      <span>{(movie.genres || []).join(' + ')}</span>
                      <span>•</span>
                      <span>${(movie.budget / 1000000).toFixed(1)}M Budget</span>
                      <span>•</span>
                      <span className="text-indigo-400">{movie.audienceInterest}% Interest</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                  <Info className="w-4 h-4 text-white/40" />
                  <span className="text-xs font-bold text-white/60">Ready for Week {movie.releaseWeek}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {STRATEGIES.map((strategy) => (
                  <button
                    key={strategy.id}
                    onClick={() => handleUpdateStrategy(movie.id, strategy.id)}
                    className={`p-6 rounded-[32px] border transition-all text-left group relative overflow-hidden ${
                      movie.releaseStrategy === strategy.id 
                        ? 'bg-white/10 border-white/20 shadow-xl' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {movie.releaseStrategy === strategy.id && (
                      <div className="absolute top-4 right-4 text-emerald-400">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-2xl ${strategy.color} flex items-center justify-center text-white mb-6`}>
                      <strategy.icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{strategy.name}</h4>
                    <p className="text-white/40 text-xs mb-6 leading-relaxed">{strategy.description}</p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {strategy.pros.map((pro, i) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                            <div className="w-1 h-1 rounded-full bg-emerald-400" />
                            {pro}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {strategy.cons.map((con, i) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                            <div className="w-1 h-1 rounded-full bg-rose-400" />
                            {con}
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

import { Film } from 'lucide-react';
