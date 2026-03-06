import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Zap, AlertCircle, TrendingUp, Info, Clock, Globe } from 'lucide-react';
import { Studio, GlobalEvent } from '../types';

interface EventCalendarProps {
  studio: Studio;
}

const SEASONAL_EVENTS = [
  { name: "Awards Season", month: "Jan - Feb", description: "Prestige and critical acclaim are prioritized.", boost: "+20% Prestige", icon: Zap, color: "bg-amber-500" },
  { name: "Summer Blockbusters", month: "Jun - Aug", description: "Peak theatrical attendance for action and family films.", boost: "+50% Revenue", icon: TrendingUp, color: "bg-indigo-500" },
  { name: "Holiday Season", month: "Nov - Dec", description: "Highest revenue potential of the year.", boost: "+80% Revenue", icon: Globe, color: "bg-emerald-500" },
];

export default function EventCalendar({ studio }: EventCalendarProps) {
  const currentWeekInYear = ((studio.currentWeek - 1) % 52) + 1;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Event Calendar</h2>
          <p className="text-white/40 mt-1">Track seasonal trends and global events affecting the industry.</p>
        </div>
        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
          <Clock className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-bold text-white">Week {studio.currentWeek}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[40px]">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Seasonal Trends
            </h3>
            <div className="space-y-4">
              {SEASONAL_EVENTS.map((event, index) => (
                <div key={index} className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-6 group hover:bg-white/10 transition-all">
                  <div className={`w-16 h-16 rounded-2xl ${event.color} flex items-center justify-center text-white shadow-lg shadow-${event.color.split('-')[1]}-500/20`}>
                    <event.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-lg font-bold text-white">{event.name}</h4>
                      <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{event.month}</span>
                    </div>
                    <p className="text-white/40 text-sm mb-2">{event.description}</p>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                      {event.boost}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-[40px]">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" />
              Active Global Events
            </h3>
            {(studio.activeEvents || []).length === 0 ? (
              <div className="text-center py-12 text-white/20 italic bg-white/5 rounded-3xl border border-dashed border-white/10">
                No active global events at this time.
              </div>
            ) : (
              <div className="space-y-4">
                {(studio.activeEvents || []).map((event) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center gap-6"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-lg font-bold text-white">{event.name}</h4>
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                          {event.duration - (studio.currentWeek - event.startWeek)} Weeks Left
                        </span>
                      </div>
                      <p className="text-white/60 text-sm mb-2">{event.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-amber-500/20 rounded-full text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                          {event.type}
                        </span>
                        <span className="text-xs font-bold text-white/40">
                          Impact: {event.impact > 1 ? '+' : ''}{Math.round((event.impact - 1) * 100)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-500/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Info className="w-5 h-5" />
              Market Insight
            </h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              The market is currently favoring {currentWeekInYear > 20 && currentWeekInYear < 30 ? 'high-budget blockbusters' : 'independent dramas'}. 
              Plan your release dates carefully to align with seasonal peaks.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">Next Major Peak</p>
                <p className="font-bold">Summer Blockbusters (Week 24)</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">Current Market Sentiment</p>
                <p className="font-bold">Bullish (+12%)</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-[40px]">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Historical Events</h3>
            <div className="space-y-4 opacity-40">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <p className="text-xs text-white">Week 4: Indie Film Renaissance</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <p className="text-xs text-white">Week 12: Streaming Platform Merger</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
