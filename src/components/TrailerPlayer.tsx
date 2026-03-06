import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Volume2, VolumeX, Film, Star, Clapperboard } from 'lucide-react';
import { Movie } from '../types';

interface TrailerPlayerProps {
  movie: Movie;
  onClose: () => void;
}

export default function TrailerPlayer({ movie, onClose }: TrailerPlayerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 md:p-12"
    >
      <div className="relative w-full max-w-6xl aspect-video bg-zinc-900 rounded-[40px] overflow-hidden shadow-2xl border border-white/10">
        {/* Mock Video Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-center space-y-8"
          >
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic">
              {movie.title}
            </h2>
            <div className="flex items-center justify-center gap-6">
              <span className="px-4 py-2 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-full">
                Coming Soon
              </span>
              <span className="text-white/40 font-bold uppercase tracking-widest text-sm">
                {(movie.genres || []).join(' + ')}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')]" />
        </div>

        {/* UI Controls */}
        <div className="absolute top-8 right-8 flex items-center gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white hover:bg-white/20 transition-all"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
          <button 
            onClick={onClose}
            className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white hover:bg-white/20 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute bottom-12 left-12 right-12 space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold uppercase tracking-widest">Highly Anticipated</span>
              </div>
              <h3 className="text-3xl font-bold text-white">{movie.title}</h3>
              <p className="text-white/60 text-sm max-w-md">
                Experience the cinematic event of the year. Directed by {movie.crew['Director'] || 'Visionary Director'}.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Production Budget</p>
                <p className="text-xl font-bold text-white">${(movie.budget / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-5 bg-white text-black rounded-3xl">
                <Clapperboard className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
