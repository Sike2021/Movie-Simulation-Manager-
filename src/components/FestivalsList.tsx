import React from 'react';
import { Calendar, Trophy, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { Studio } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FestivalsListProps {
  studio: Studio;
}

export default function FestivalsList({ studio }: FestivalsListProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-sm font-bold flex items-center gap-2 text-zinc-800">
        <Calendar className="w-4 h-4 text-[#2B59C3]" />
        Industry Festivals
      </h2>
      <div className="space-y-4">
        {studio.festivals?.map(festival => {
          const isUpcoming = festival.week > studio.currentWeek;
          const isCurrent = festival.week === studio.currentWeek;
          
          return (
            <div 
              key={festival.id} 
              className={cn(
                "bg-white rounded-2xl p-5 shadow-sm border transition-all",
                isCurrent ? "border-[#2B59C3] ring-1 ring-[#2B59C3]/20" : "border-zinc-100"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isCurrent ? "bg-[#2B59C3] text-white" : "bg-zinc-50 text-zinc-400"
                  )}>
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={cn(
                      "font-bold text-sm",
                      isCurrent ? "text-[#2B59C3]" : "text-zinc-800"
                    )}>
                      {festival.name}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      {isUpcoming ? `Week ${festival.week}` : isCurrent ? 'Live Now' : 'Completed'}
                    </p>
                  </div>
                </div>
                {isCurrent && (
                  <span className="bg-[#2B59C3] text-white text-[8px] font-black uppercase px-2 py-1 rounded-full">Live</span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold block mb-1">Prestige</span>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-sm font-bold text-zinc-800">{festival.prestige}</span>
                  </div>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold block mb-1">Reputation</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-sm font-bold text-zinc-800">+{festival.reputationBonus}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
