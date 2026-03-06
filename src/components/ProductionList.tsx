import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, DollarSign, Plus, Clapperboard, Clock } from 'lucide-react';
import { Studio, MovieStatus } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductionListProps {
  studio: Studio;
  onNewProject: () => void;
}

export default function ProductionList({ studio, onNewProject }: ProductionListProps) {
  const productionMovies = (studio.projects || []).filter(p => 
    p.status === MovieStatus.PRE_PRODUCTION || 
    p.status === MovieStatus.FILMING || 
    p.status === MovieStatus.POST_PRODUCTION
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold flex items-center gap-2 text-zinc-800">
          <Film className="w-4 h-4 text-[#2B59C3]" />
          Active Productions
        </h2>
        <button 
          onClick={onNewProject}
          className="text-[10px] bg-[#2B59C3] text-white px-4 py-2 rounded-full flex items-center gap-1.5 transition-all active:scale-95 font-bold uppercase tracking-wider shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-3.5 h-3.5" />
          Greenlight
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {productionMovies.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white border-2 border-dashed border-zinc-100 rounded-2xl p-12 flex flex-col items-center justify-center text-zinc-400"
            >
              <Clapperboard className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-wider">No active productions</p>
            </motion.div>
          ) : (
            productionMovies.map(movie => {
              const universe = studio.universes?.find(u => u.id === movie.universeId);
              const franchise = studio.franchises?.find(f => f.id === movie.franchiseId);
              
              let stageMax = 4;
              if (movie.status === MovieStatus.FILMING) stageMax = 8;
              if (movie.status === MovieStatus.POST_PRODUCTION) stageMax = 4;
              
              const progress = Math.max(0, Math.min(100, (movie.progress / stageMax) * 100));
              
              return (
                <motion.div 
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 group transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-16 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-300 overflow-hidden relative">
                      <img 
                        src={`https://picsum.photos/seed/${movie.id}/100/150`} 
                        alt="" 
                        className="w-full h-full object-cover opacity-60"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-zinc-800 text-sm mb-1">{movie.title}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] font-bold text-[#2B59C3] bg-[#D1E3FF] px-2 py-0.5 rounded-full uppercase">
                          ${(movie.budget / 1000000).toFixed(1)}M
                        </span>
                        {(movie.genres || []).map(g => (
                          <span key={g} className="text-[9px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full uppercase">
                            {g}
                          </span>
                        ))}
                        {universe && (
                          <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                            {universe.name}
                          </span>
                        )}
                        {franchise && (
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase">
                            {franchise.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider">
                      <span className="text-zinc-400">{movie.status} Progress</span>
                      <span className="text-[#2B59C3] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {stageMax - movie.progress} Weeks Left
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-[#2B59C3] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
