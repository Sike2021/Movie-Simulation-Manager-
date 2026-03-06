import React from 'react';
import { Movie, MovieStatus } from '../types';

interface ProductionViewProps {
  movies: Movie[];
}

export const ProductionView: React.FC<ProductionViewProps> = ({ movies }) => {
  const active = movies.filter(m => 
    m.status !== MovieStatus.COMPLETED && 
    m.status !== MovieStatus.RELEASED
  );

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-800">Active Productions</h2>
      <div className="space-y-3">
        {active.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-zinc-100 rounded-2xl p-12 flex flex-col items-center justify-center text-zinc-400">
            <p className="text-xs font-bold uppercase tracking-wider">No active productions</p>
          </div>
        ) : (
          active.map(movie => (
            <div key={movie.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
              <div>
                <span className="block text-xs font-bold text-zinc-800">{movie.title}</span>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{movie.genre}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-[#2B59C3] bg-[#D1E3FF] px-2 py-1 rounded-lg uppercase">
                  {movie.status}
                </span>
                <span className="text-[8px] font-bold text-zinc-300 uppercase mt-1 block">
                  {movie.progress} Weeks Progress
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
