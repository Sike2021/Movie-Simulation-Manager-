import React from 'react';
import { User, Briefcase, Award, TrendingUp, DollarSign } from 'lucide-react';
import { player } from '../core/player';

export default function PlayerProfile() {
  return (
    <div className="space-y-6 pb-8">
      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D1E3FF] rounded-full -mr-16 -mt-16 opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#2B59C3] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{player.studioName}</h1>
              <p className="text-gray-500 font-medium flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                CEO: {player.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-2xl font-bold text-emerald-600">
            <DollarSign className="w-6 h-6" />
            <span>{player.cash.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Movies Produced</p>
          <p className="text-2xl font-bold text-gray-900">{player.stats.moviesProduced}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Awards Won</p>
          <p className="text-2xl font-bold text-gray-900">{player.stats.awardsWon}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Franchises</p>
          <p className="text-2xl font-bold text-gray-900">{player.stats.franchisesOwned}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Total Box Office</p>
          <p className="text-2xl font-bold text-gray-900 truncate">
            ${(player.stats.totalBoxOffice / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Career Progress Placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Career Milestones</h3>
        <div className="space-y-4">
          {[
            { label: 'First Blockbuster', completed: player.stats.totalBoxOffice > 100000000 },
            { label: 'Award Winner', completed: player.stats.awardsWon > 0 },
            { label: 'Studio Legend', completed: player.stats.moviesProduced >= 10 },
          ].map((milestone, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${milestone.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200'}`}>
                {milestone.completed && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className={`text-sm font-medium ${milestone.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                {milestone.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
