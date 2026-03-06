import React from 'react';
import { motion } from 'motion/react';
import { Trophy, TrendingUp, DollarSign, Star, Target, Shield } from 'lucide-react';
import { Studio, RivalStudio } from '../types';

interface RivalStudiosDashboardProps {
  studio: Studio;
}

export default function RivalStudiosDashboard({ studio }: RivalStudiosDashboardProps) {
  const allStudios = [
    { 
      id: 'player', 
      name: studio.name + " (You)", 
      money: studio.money, 
      prestige: studio.reputation,
      isPlayer: true 
    },
    ...(studio.rivals || []).map(r => ({ 
      id: r.id,
      name: r.name,
      money: r.money,
      prestige: r.prestige,
      isPlayer: false 
    }))
  ].sort((a, b) => b.prestige - a.prestige);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Industry Rankings</h1>
          <p className="text-white/40 mt-1">See how your studio compares to the global competition.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {allStudios.map((s, index) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-[32px] border flex flex-col md:flex-row items-center gap-6 transition-all ${
              s.isPlayer 
                ? 'bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                : 'bg-white/5 border-white/5'
            }`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 text-xl font-black text-white">
              {index + 1}
            </div>

            {/* Studio Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="text-xl font-bold text-white">{s.name}</h3>
                {s.isPlayer && <div className="px-2 py-0.5 bg-indigo-500 text-white text-[8px] font-bold uppercase rounded-full">Player</div>}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                <div className="flex items-center gap-1 text-white/40 text-xs">
                  <DollarSign className="w-3 h-3" />
                  ${(s.money / 1000000).toFixed(1)}M
                </div>
                <div className="flex items-center gap-1 text-white/40 text-xs">
                  <Star className="w-3 h-3 text-amber-400" />
                  {s.prestige.toFixed(0)} Prestige
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full md:w-48 space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                <span>Market Share</span>
                <span>{Math.round((s.prestige / 100) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${s.prestige}%` }}
                  className={`h-full ${s.isPlayer ? 'bg-indigo-500' : 'bg-white/20'}`}
                />
              </div>
            </div>

            {/* Action Icon */}
            <div className={`p-4 rounded-2xl ${s.isPlayer ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/20'}`}>
              {index === 0 ? <Trophy className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Annual Awards Teaser */}
      <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-8 rounded-[40px] border border-white/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl">
            <Target className="w-10 h-10 text-indigo-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">Annual Studio Awards</h3>
            <p className="text-white/60 text-sm max-w-lg">
              The studio with the highest prestige at the end of the year (Week 52) will be crowned "Studio of the Year" and receive exclusive bonuses.
            </p>
          </div>
          <button className="px-8 py-4 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all">
            View Hall of Fame
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Shield className="w-64 h-64 text-white" />
        </div>
      </div>
    </div>
  );
}
