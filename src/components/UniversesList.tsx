import React from 'react';
import { Globe, Plus, Layers, Users } from 'lucide-react';
import { Studio } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UniversesListProps {
  studio: Studio;
  onNewUniverse: () => void;
}

export default function UniversesList({ studio, onNewUniverse }: UniversesListProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold flex items-center gap-2 text-zinc-800">
          <Globe className="w-4 h-4 text-[#2B59C3]" />
          Cinematic Universes
        </h2>
        <button 
          onClick={onNewUniverse}
          className="text-[10px] bg-[#2B59C3] text-white px-4 py-2 rounded-full flex items-center gap-1.5 transition-all active:scale-95 font-bold uppercase tracking-wider shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-3.5 h-3.5" />
          New Universe
        </button>
      </div>

      <div className="space-y-4">
        {studio.universes?.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-zinc-100 rounded-2xl p-12 text-center text-zinc-400">
            <Globe className="w-12 h-12 mb-3 opacity-20 mx-auto" />
            <p className="text-xs font-bold uppercase tracking-wider">No universes created</p>
          </div>
        ) : (
          studio.universes?.map(universe => (
            <div key={universe.id} className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D1E3FF] rounded-xl flex items-center justify-center text-[#2B59C3]">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-800">{universe.name}</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold block mb-1">Franchises</span>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-sm font-bold text-zinc-800">{universe.franchiseIds?.length || 0}</span>
                  </div>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold block mb-1">Characters</span>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-sm font-bold text-zinc-800">{universe.characterIds?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
