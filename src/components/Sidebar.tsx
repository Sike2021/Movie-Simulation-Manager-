import React from 'react';
import { History, Users, DollarSign, Film, TrendingUp } from 'lucide-react';
import { Studio, MovieStatus } from '../types';

interface SidebarProps {
  studio: Studio;
}

export default function Sidebar({ studio }: SidebarProps) {
  const projects = studio.projects || [];
  const releasedMovies = projects.filter(p => p.status === MovieStatus.RELEASED);
  const totalBoxOffice = projects.reduce((a, b) => a + b.boxOffice, 0);

  return (
    <div className="space-y-8">
      {/* Studio Summary */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-6 text-zinc-100">Studio Report</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-zinc-500" />
              <span className="text-sm text-zinc-400">Total Movies</span>
            </div>
            <span className="font-mono font-bold">{projects.length}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-zinc-500" />
              <span className="text-sm text-zinc-400">Released</span>
            </div>
            <span className="font-mono font-bold text-emerald-500">{releasedMovies.length}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-zinc-500" />
              <span className="text-sm text-zinc-400">Total Gross</span>
            </div>
            <span className="font-mono font-bold text-emerald-400">${totalBoxOffice.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mt-8 p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-500 mb-3">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Talent Pool</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Build your reputation to attract A-list actors and legendary directors. Higher prestige unlocks bigger stars.
          </p>
        </div>
      </div>

      {/* History / Feed */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
          <History className="w-4 h-4" />
          Recent Activity
        </h2>
        <div className="space-y-6">
          {releasedMovies.slice(-3).reverse().map(movie => (
            <div key={movie.id} className="flex gap-4 group">
              <div className="w-1 h-auto bg-emerald-500/20 rounded-full group-hover:bg-emerald-500/50 transition-colors" />
              <div>
                <p className="text-xs text-zinc-300 font-medium leading-tight">"{movie.title}" finished its theatrical run.</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-zinc-500 font-mono">${movie.boxOffice.toLocaleString()}</span>
                  <span className={`text-[8px] font-bold px-1 rounded ${movie.boxOffice > movie.budget ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {movie.boxOffice > movie.budget ? 'PROFIT' : 'LOSS'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-xs text-zinc-600 italic text-center py-4">No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
