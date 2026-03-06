import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Layers, Users, Plus, X, 
  ChevronRight, Star, Shield, Zap, 
  Map, History, TrendingUp, Award
} from 'lucide-react';
import { Studio, Universe, Franchise, Character } from '../types';

interface UniverseManagerProps {
  studio: Studio;
  onUpdateStudio: (studio: Studio) => void;
}

export default function UniverseManager({ studio, onUpdateStudio }: UniverseManagerProps) {
  const [activeTab, setActiveTab] = useState<'universes' | 'characters' | 'timeline'>('universes');
  const [selectedUniverseId, setSelectedUniverseId] = useState<string | null>(null);

  const selectedUniverse = studio.universes?.find(u => u.id === selectedUniverseId);

  const handleCreateUniverse = () => {
    const name = prompt("Enter Universe Name:");
    if (!name) return;
    
    const newUniverse: Universe = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      franchiseIds: [],
      characterIds: [],
      continuityScore: 100,
      totalBoxOffice: 0
    };

    onUpdateStudio({
      ...studio,
      universes: [...(studio.universes || []), newUniverse]
    });
  };

  const handleCreateFranchise = (universeId: string) => {
    const name = prompt("Enter Franchise Name:");
    if (!name) return;

    const newFranchise: Franchise = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      universeId,
      projectIds: [],
      characterIds: [],
      fanBase: 1000,
      hype: 50
    };

    const updatedUniverses = studio.universes?.map(u => 
      u.id === universeId ? { ...u, franchiseIds: [...(u.franchiseIds || []), newFranchise.id] } : u
    );

    onUpdateStudio({
      ...studio,
      franchises: [...(studio.franchises || []), newFranchise],
      universes: updatedUniverses
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Universe Control</h1>
          <p className="text-white/40 mt-1">Manage your cinematic empires and interconnected sagas.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCreateUniverse}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            New Universe
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 w-fit">
        {[
          { id: 'universes', label: 'Universes', icon: Globe },
          { id: 'characters', label: 'Characters', icon: Users },
          { id: 'timeline', label: 'Timeline', icon: History },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-white text-black shadow-lg' 
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'universes' && (
          <motion.div 
            key="universes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Universe List */}
            <div className="lg:col-span-1 space-y-4">
              {(studio.universes || []).map(universe => (
                <button
                  key={universe.id}
                  onClick={() => setSelectedUniverseId(universe.id)}
                  className={`w-full p-6 rounded-[32px] border text-left transition-all relative overflow-hidden group ${
                    selectedUniverseId === universe.id
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'
                  }`}
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${selectedUniverseId === universe.id ? 'bg-white/20' : 'bg-white/5'}`}>
                        <Globe className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${(universe.totalBoxOffice / 1000000).toFixed(1)}M</div>
                        <div className="text-[10px] uppercase font-bold opacity-60">Total Revenue</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{universe.name}</h3>
                    <div className="flex gap-4 text-[10px] uppercase font-bold opacity-60">
                      <span>{universe.franchiseIds?.length || 0} Franchises</span>
                      <span>{universe.characterIds?.length || 0} Characters</span>
                    </div>
                  </div>
                  {/* Background Decoration */}
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Globe className="w-32 h-32" />
                  </div>
                </button>
              ))}
              
              {(!studio.universes || studio.universes.length === 0) && (
                <div className="p-12 border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center text-center">
                  <Globe className="w-12 h-12 text-white/10 mb-4" />
                  <p className="text-white/20 text-sm font-bold">No universes established yet.</p>
                </div>
              )}
            </div>

            {/* Universe Details */}
            <div className="lg:col-span-2">
              {selectedUniverse ? (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <div className="text-indigo-400 mb-2"><TrendingUp className="w-5 h-5" /></div>
                      <div className="text-2xl font-bold text-white">{selectedUniverse.continuityScore}%</div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Continuity</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <div className="text-amber-400 mb-2"><Award className="w-5 h-5" /></div>
                      <div className="text-2xl font-bold text-white">
                        { (studio.projects || []).filter(p => p.universeId === selectedUniverse.id).length}
                      </div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Movies Released</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <div className="text-emerald-400 mb-2"><Users className="w-5 h-5" /></div>
                      <div className="text-2xl font-bold text-white">
                        {studio.franchises?.filter(f => f.universeId === selectedUniverse.id).reduce((acc, f) => acc + f.fanBase, 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total Fans</div>
                    </div>
                  </div>

                  {/* Franchises Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-indigo-400" />
                        Active Franchises
                      </h3>
                      <button 
                        onClick={() => handleCreateFranchise(selectedUniverse.id)}
                        className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
                      >
                        + Add Franchise
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {studio.franchises?.filter(f => f.universeId === selectedUniverse.id).map(franchise => (
                        <div key={franchise.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-white">{franchise.name}</h4>
                            <div className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-[9px] font-bold uppercase">
                              {franchise.hype}% Hype
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-white/30 uppercase">Projects</span>
                              <span className="text-white">{franchise.projectIds?.length || 0}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-white/30 uppercase">Fan Base</span>
                              <span className="text-white">{franchise.fanBase.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/5 rounded-[40px] border border-white/5 border-dashed">
                  <Map className="w-16 h-16 text-white/5 mb-6" />
                  <h3 className="text-xl font-bold text-white/20">Select a universe to view details</h3>
                  <p className="text-white/10 text-sm mt-2 max-w-xs">Track continuity, franchises, and character arcs across your cinematic world.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'characters' && (
          <motion.div 
            key="characters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* This would ideally list characters from studio.characters */}
              <div className="p-12 border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center text-center col-span-full">
                <Users className="w-12 h-12 text-white/10 mb-4" />
                <p className="text-white/20 text-sm font-bold">Character management coming soon.</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div 
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="p-12 border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center text-center">
              <History className="w-12 h-12 text-white/10 mb-4" />
              <p className="text-white/20 text-sm font-bold">Franchise timeline visualization coming soon.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
