import React from 'react';
import { Movie } from '../types';

interface MovieLibraryProps {
  movies: Movie[];
}

export const MovieLibrary: React.FC<MovieLibraryProps> = ({ movies }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-800">Movie Library</h2>
        <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full">
          {movies.length} Titles
        </span>
      </div>
      <div className="grid gap-4">
        {movies.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-zinc-100 rounded-2xl p-12 flex flex-col items-center justify-center text-zinc-400">
            <p className="text-xs font-bold uppercase tracking-wider">No movies in library yet</p>
          </div>
        ) : (
          movies.map(movie => (
            <div key={movie.id} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-zinc-800">{movie.title}</h3>
                <span className="text-[9px] font-bold text-[#2B59C3] bg-[#D1E3FF] px-2 py-0.5 rounded-full uppercase">
                  {movie.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-tight text-zinc-500">
                <div>
                  <span className="block text-zinc-300 text-[8px] mb-0.5">Genres</span>
                  {(movie.genres || []).join(' + ')}
                </div>
                <div>
                  <span className="block text-zinc-300 text-[8px] mb-0.5">Budget</span>
                  ${movie.budget.toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
