import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Megaphone, Users, Globe, Tv, Share2, Zap, DollarSign, Plus } from 'lucide-react';
import { Studio, Movie, MarketingCampaign } from '../types';

interface MarketingPlannerProps {
  studio: Studio;
  onUpdateStudio: (studio: Studio) => void;
}

const CAMPAIGN_TYPES = [
  { type: "Social Media", cost: 50000, impact: 15, icon: Share2, color: "bg-blue-500" },
  { type: "TV Spots", cost: 250000, impact: 40, icon: Tv, color: "bg-purple-500" },
  { type: "Billboards", cost: 100000, impact: 25, icon: Globe, color: "bg-emerald-500" },
  { type: "Press Tour", cost: 500000, impact: 65, icon: Users, color: "bg-amber-500" },
  { type: "Viral", cost: 20000, impact: 10, icon: Zap, color: "bg-rose-500" },
] as const;

export default function MarketingPlanner({ studio, onUpdateStudio }: MarketingPlannerProps) {
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const activeMovies = (studio.projects || []).filter(p => p.status !== "Released" && p.status !== "Archived");

  const handleAddCampaign = (type: typeof CAMPAIGN_TYPES[number]) => {
    if (!selectedMovieId) return;
    if (studio.money < type.cost) return;

    const newCampaign: MarketingCampaign = {
      type: type.type,
      cost: type.cost,
      impact: type.impact,
      weekStarted: studio.currentWeek
    };

    const updatedProjects = (studio.projects || []).map(p => {
      if (p.id === selectedMovieId) {
        return {
          ...p,
          marketingCampaigns: [...(p.marketingCampaigns || []), newCampaign],
          totalMarketingSpend: (p.totalMarketingSpend || 0) + type.cost,
          audienceInterest: Math.min(100, (p.audienceInterest || 0) + type.impact)
        };
      }
      return p;
    });

    onUpdateStudio({
      ...studio,
      money: studio.money - type.cost,
      projects: updatedProjects
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Marketing Planner</h2>
          <p className="text-white/40 mt-1">Build hype and increase audience interest for your upcoming releases.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest px-2">Select Project</h3>
          <div className="space-y-2">
            {activeMovies.map(movie => (
              <button
                key={movie.id}
                onClick={() => setSelectedMovieId(movie.id)}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                  selectedMovieId === movie.id 
                    ? 'bg-indigo-500/10 border-indigo-500 text-white' 
                    : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <div>
                  <p className="font-bold">{movie.title}</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-50">{movie.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-indigo-400">{movie.audienceInterest}% Interest</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!selectedMovieId ? (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-white/5 border border-dashed border-white/10 rounded-[40px] text-white/20">
              <Megaphone className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">Select a movie to plan its marketing</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CAMPAIGN_TYPES.map((campaign, index) => (
                  <motion.button
                    key={campaign.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleAddCampaign(campaign)}
                    disabled={studio.money < campaign.cost}
                    className="p-6 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${campaign.color} text-white`}>
                        <campaign.icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <DollarSign className="w-4 h-4" />
                        {(campaign.cost / 1000).toFixed(0)}k
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{campaign.type}</h4>
                    <p className="text-white/40 text-xs mb-4">Increases interest by ~{campaign.impact}%</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Launch Campaign</span>
                      <Plus className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-[40px]">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Active Campaigns</h3>
                <div className="space-y-4">
                  {studio.projects.find(p => p.id === selectedMovieId)?.marketingCampaigns?.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{c.type}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">Started Week {c.weekStarted}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-emerald-400">+ {c.impact}% Interest</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest">${c.cost.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {(studio.projects.find(p => p.id === selectedMovieId)?.marketingCampaigns || []).length === 0 && (
                    <p className="text-center text-white/20 py-8 italic">No active campaigns for this project.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
