import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Film, DollarSign, Calendar, Trophy, BarChart3, Bell, Star, ArrowUpRight, Play } from 'lucide-react';
import { Studio, MovieStatus, Movie } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardProps {
  studio: Studio;
  onNavigate: (tab: any) => void;
  onWatchTrailer?: (movie: Movie) => void;
}

export default function Dashboard({ studio, onNavigate, onWatchTrailer }: DashboardProps) {
  const projects = studio.projects || [];
  const releasedMovies = projects.filter(p => p.status === MovieStatus.RELEASED);
  const completedMovies = projects.filter(p => p.status === MovieStatus.COMPLETED);
  const productionMovies = projects.filter(p => 
    p.status === MovieStatus.PRE_PRODUCTION || 
    p.status === MovieStatus.FILMING || 
    p.status === MovieStatus.POST_PRODUCTION
  );
  const totalBoxOffice = projects.reduce((a, b) => a + b.boxOffice, 0);
  const recentNotifications = [...(studio.notifications || [])].reverse().slice(0, 5);

  const currentFestival = (studio.festivals || []).find(f => f.week === studio.currentWeek);

  return (
    <div className="space-y-6">
      {/* Prestige & Wealth Header */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 shadow-xl shadow-indigo-500/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Studio Prestige</div>
              <div className="text-3xl font-bold text-white">{studio.reputation}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-white/60 uppercase">
              <span>Industry Rank</span>
              <span>{studio.reputation > 80 ? 'Elite' : studio.reputation > 50 ? 'Major' : 'Indie'}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(studio.reputation, 100)}%` }}
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Liquid Assets</div>
              <div className="text-3xl font-bold text-white">${(studio.money / 1000000).toFixed(1)}M</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Total Gross: ${(totalBoxOffice / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications / Feed */}
        <section className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold flex items-center gap-2 text-white">
              <Bell className="w-4 h-4 text-indigo-400" />
              Studio Feed
            </h2>
            <span className="text-[10px] font-bold text-white/30 uppercase">Live Updates</span>
          </div>
          <div className="divide-y divide-white/5">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((n) => (
                <div key={n.id} className="p-4 flex gap-4 hover:bg-white/5 transition-colors">
                  <div className={cn(
                    "w-1 h-8 rounded-full flex-shrink-0 mt-1",
                    n.type === 'milestone' ? "bg-indigo-500" : 
                    n.type === 'award' ? "bg-amber-500" : 
                    n.type === 'revenue' ? "bg-emerald-500" : "bg-zinc-500"
                  )} />
                  <div>
                    <p className="text-sm text-white/90 leading-snug">{n.message}</p>
                    <p className="text-[10px] text-white/30 font-bold uppercase mt-1">Week {n.week}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-white/20 text-xs italic">
                No recent activity. Start production to see updates.
              </div>
            )}
          </div>
        </section>

        {/* Industry Events & Projects */}
        <div className="space-y-6">
          <section className="bg-zinc-900 border border-white/10 rounded-3xl p-5">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Industry Events
            </h2>
            {currentFestival ? (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{currentFestival.name}</h3>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase">Active Now</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('marketing')}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <div className="text-xs text-white/30 italic py-2 px-2">No major festivals this week.</div>
            )}
          </section>

          <section className="bg-zinc-900 border border-white/10 rounded-3xl p-5">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
              <Film className="w-4 h-4 text-indigo-400" />
              Active Productions
            </h2>
            <div className="space-y-3">
              {productionMovies.slice(0, 3).map(movie => (
                <div key={movie.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xs">{movie.title}</h3>
                      <p className="text-[9px] text-white/40 font-bold uppercase">{movie.status}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-indigo-400">{Math.round(movie.progress * 10)}%</div>
                </div>
              ))}
              {productionMovies.length === 0 && (
                <div className="text-xs text-white/30 italic py-2 px-2">No movies in production.</div>
              )}
              <button 
                onClick={() => onNavigate('production')}
                className="w-full py-2 mt-2 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors"
              >
                View Production Slate
              </button>
            </div>
          </section>

          {completedMovies.length > 0 && (
            <section className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white">Latest Trailer</h2>
                <span className="px-2 py-0.5 bg-indigo-500 text-white text-[8px] font-bold uppercase rounded-full">New</span>
              </div>
              <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden group cursor-pointer" onClick={() => onWatchTrailer?.(completedMovies[0])}>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-indigo-500 fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-bold text-white drop-shadow-lg">{completedMovies[0].title}</p>
                  <p className="text-[10px] text-white/60 font-medium drop-shadow-lg">Watch Preview</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
