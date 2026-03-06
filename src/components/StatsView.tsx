import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Trophy, 
  Star, 
  Calendar, 
  TrendingUp, 
  Film, 
  Layers, 
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import { Studio, MovieStatus } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatsViewProps {
  studio: Studio;
  onSimulate: () => void;
  hideHeader?: boolean;
}

export default function StatsView({ studio, onSimulate, hideHeader = false }: StatsViewProps) {
  const projects = studio.projects || [];
  const releasedMovies = projects.filter(p => p.status === MovieStatus.RELEASED);
  const totalGross = releasedMovies.reduce((sum, m) => sum + m.boxOffice, 0);
  const totalBudget = releasedMovies.reduce((sum, m) => sum + m.budget, 0);
  const totalReturns = totalGross - totalBudget;
  
  const avgReview = releasedMovies.length > 0 
    ? Math.round(releasedMovies.reduce((sum, m) => sum + (m.criticScore || 0), 0) / releasedMovies.length)
    : 0;

  const wins = (studio.awards || []).length;
  const noms = wins * 2;

  const popularityData = [
    { name: 'NA', value: 85 },
    { name: 'AP', value: 65 },
    { name: 'EU', value: 45 },
    { name: 'AF', value: 30 },
    { name: 'LA', value: 20 },
  ];

  const activeEvents = studio.festivals.filter(f => f.week >= studio.currentWeek && f.week <= studio.currentWeek + 4);

  return (
    <div className={cn("max-w-4xl mx-auto bg-[#0A0A0B] min-h-screen pb-24 font-sans text-white", hideHeader && "min-h-0 pb-0")}>
      <div className={cn("space-y-6 mt-2", hideHeader && "mt-0")}>
        {/* Lifetime Stats */}
        <section className="bg-zinc-900 rounded-3xl p-6 border border-white/10">
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-white/40 uppercase tracking-widest">
            Lifetime Performance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="Movies Made" value={releasedMovies.length.toString()} />
            <StatBox label="Franchises" value={studio.franchises.length.toString()} />
            <StatBox label="Total Gross" value={`${(totalGross / 1000000).toFixed(1)}M`} />
            <StatBox label="Total Returns" value={`${(totalReturns / 1000000).toFixed(1)}M`} />
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regional Popularity */}
          <section className="bg-zinc-900 rounded-3xl p-6 border border-white/10">
            <h2 className="text-sm font-bold mb-6 text-white/40 uppercase tracking-widest">Global Reach</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: 'rgba(255,255,255,0.3)' }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
                    {popularityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#6366f1" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Critical Reception */}
          <section className="bg-zinc-900 rounded-3xl p-6 border border-white/10">
            <h2 className="text-sm font-bold mb-6 text-white/40 uppercase tracking-widest">Critical Reception</h2>
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center border border-white/5">
                <span className="text-[10px] uppercase font-bold text-white/40 mb-2">Avg. Critic Score</span>
                <div className="text-5xl font-bold text-white mb-3">{avgReview}%</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={cn(
                        "w-4 h-4 fill-current",
                        s <= Math.round(avgReview / 20) ? "text-amber-400" : "text-white/10"
                      )} 
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Awards Won</div>
                  <div className="text-2xl font-bold text-white">{wins}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Nominations</div>
                  <div className="text-2xl font-bold text-white">{noms}</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Active Events */}
        <section className="bg-zinc-900 rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">Festival Calendar</h2>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md uppercase">Upcoming</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeEvents.length > 0 ? activeEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{event.name}</div>
                    <div className="text-[10px] text-white/30 font-bold uppercase">Week {event.week}</div>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
              </div>
            )) : (
              <p className="text-xs text-white/30 italic col-span-2 text-center py-4">No major festivals in the next 4 weeks.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
      <span className="text-[9px] uppercase font-bold text-white/30 mb-1 leading-tight tracking-widest">{label}</span>
      <span className="text-xl font-bold text-white">{value}</span>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: { icon: any; label: string; active?: boolean }) {
  return (
    <button className={cn(
      "flex flex-col items-center gap-1 transition-all",
      active ? "text-[#2B59C3]" : "text-zinc-400 hover:text-zinc-600"
    )}>
      <div className={cn(
        "p-1.5 rounded-full transition-all",
        active ? "bg-[#D1E3FF]" : "bg-transparent"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}
