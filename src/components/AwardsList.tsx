import React from 'react';
import { Trophy, Film, Calendar } from 'lucide-react';
import { Studio } from '../types';

interface AwardsListProps {
  studio: Studio;
}

export default function AwardsList({ studio }: AwardsListProps) {
  return (
    <section>
      <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-6">
        <Trophy className="w-4 h-4" />
        Studio Awards
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studio.awards?.length === 0 ? (
          <div className="col-span-full border-2 border-dashed border-zinc-800 rounded-2xl p-16 text-center text-zinc-600">
            <Trophy className="w-16 h-16 mb-4 opacity-10 mx-auto" />
            <p className="text-sm font-medium">No awards yet. Keep producing quality films!</p>
          </div>
        ) : (
          studio.awards?.map(award => {
            const movie = (studio.projects || []).find(p => p.id === award.movieId);
            return (
              <div key={award.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-6 group hover:border-amber-500/30 transition-colors">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-zinc-100">{award.category}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    <Film className="w-3 h-3" />
                    Winner: <span className="text-zinc-300 font-medium">"{movie?.title}"</span>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <span className="text-[8px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-lg uppercase font-bold tracking-widest border border-zinc-700">{award.type}</span>
                    <span className="text-[10px] text-zinc-600 uppercase font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Year {award.year}
                    </span>
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
