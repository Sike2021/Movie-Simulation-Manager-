import React from 'react';
import { Layers, Plus, Film } from 'lucide-react';
import { Studio } from '../types';

interface FranchisesListProps {
  studio: Studio;
  onNewFranchise: () => void;
}

export default function FranchisesList({ studio, onNewFranchise }: FranchisesListProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Active Franchises
        </h2>
        <button 
          onClick={onNewFranchise}
          className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 font-bold shadow-lg shadow-amber-900/20"
        >
          <Plus className="w-3.5 h-3.5" />
          New Franchise
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studio.franchises?.length === 0 ? (
          <div className="col-span-full border-2 border-dashed border-zinc-800 rounded-2xl p-16 text-center text-zinc-600">
            <Layers className="w-16 h-16 mb-4 opacity-10 mx-auto" />
            <p className="text-sm font-medium">No franchises yet. Start a saga!</p>
          </div>
        ) : (
          studio.franchises?.map(franchise => {
            const universe = studio.universes?.find(u => u.id === franchise.universeId);
            return (
              <div key={franchise.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/50 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xl text-amber-400 group-hover:text-amber-300 transition-colors">{franchise.name}</h3>
                  <Layers className="w-6 h-6 text-zinc-700 group-hover:text-amber-500/50 transition-colors" />
                </div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-6">
                  Universe: <span className="text-zinc-300">{universe?.name || 'None'}</span>
                </p>
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Total Projects</span>
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-zinc-600" />
                    <span className="text-2xl font-mono font-bold">{franchise.projectIds?.length || 0}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
