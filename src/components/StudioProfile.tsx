import React from 'react';
import { motion } from 'motion/react';
import { UserCircle, Globe, Layers, Film, Trophy, DollarSign, TrendingUp, Users, Plus, Zap } from 'lucide-react';
import { Studio, MovieStatus, TeamMember } from '../types';

interface StudioProfileProps {
  studio: Studio;
  onHireStaff?: (member: TeamMember) => void;
}

export default function StudioProfile({ studio }: StudioProfileProps) {
  const projects = studio.projects || [];
  const releasedMovies = projects.filter(p => p.status === MovieStatus.RELEASED);
  const totalBoxOffice = projects.reduce((a, b) => a + b.boxOffice, 0);
  const totalBudget = projects.reduce((a, b) => a + b.budget, 0);
  const profit = totalBoxOffice - totalBudget;
  const staff = studio.staff || [];
  const universes = studio.universes || [];
  const franchises = studio.franchises || [];
  const awards = studio.awards || [];

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-900/40">
          <UserCircle className="text-white w-12 h-12" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">{studio.name}</h1>
          <p className="text-zinc-500 font-medium mt-1">Leading the industry since Week 1</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
            <div className="bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-zinc-300">Reputation: {studio.reputation}</span>
            </div>
            <div className="bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-bold text-zinc-300">Capital: ${studio.money.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Staff Management */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Studio Personnel
          </h2>
          <span className="text-[10px] font-bold text-zinc-500 uppercase">{staff.length} Active Members</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staff.map((member) => (
            <div key={member.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{member.name}</div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase">{member.role} • Skill: {member.skill}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[8px] text-amber-400 font-bold uppercase">Speed: +{Math.round(member.speedModifier * 100)}%</span>
                    <span className="text-[8px] text-emerald-400 font-bold uppercase">Quality: +{Math.round(member.qualityModifier * 100)}%</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-zinc-500 font-bold uppercase">Salary</div>
                <div className="text-xs font-bold text-emerald-400">${(member.salary / 1000).toFixed(0)}k</div>
              </div>
            </div>
          ))}
          {staff.length === 0 && (
            <div className="col-span-2 py-8 text-center text-zinc-600 text-sm italic border border-dashed border-zinc-800 rounded-2xl">
              No staff hired yet. Visit the Staff Recruitment panel to build your team.
            </div>
          )}
        </div>
      </section>

      {/* Lifetime Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Movies Made</span>
          <div className="text-2xl font-mono font-bold text-zinc-100">{projects.length}</div>
          <div className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
            <Film className="w-3 h-3" />
            {releasedMovies.length} Released
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Universes</span>
          <div className="text-2xl font-mono font-bold text-indigo-400">{universes.length}</div>
          <div className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Shared Worlds
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Franchises</span>
          <div className="text-2xl font-mono font-bold text-amber-400">{franchises.length}</div>
          <div className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Active Sagas
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Awards</span>
          <div className="text-2xl font-mono font-bold text-emerald-400">{awards.length}</div>
          <div className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            Prestige Accolades
          </div>
        </div>
      </section>

      {/* Financial Overview */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-6">
          <DollarSign className="w-4 h-4" />
          Financial Performance
        </h2>
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-xs text-zinc-500 font-bold uppercase">Total Box Office</span>
              <div className="text-3xl font-mono font-bold text-emerald-400">${totalBoxOffice.toLocaleString()}</div>
            </div>
            <div className="text-right space-y-1">
              <span className="text-xs text-zinc-500 font-bold uppercase">Lifetime Profit</span>
              <div className={`text-xl font-mono font-bold ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {profit >= 0 ? '+' : ''}${profit.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (totalBoxOffice / (totalBoxOffice + totalBudget)) * 100)}%` }} />
            <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, (totalBudget / (totalBoxOffice + totalBudget)) * 100)}%` }} />
          </div>
          
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-zinc-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full" />
              <span className="text-zinc-400">Investment</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
