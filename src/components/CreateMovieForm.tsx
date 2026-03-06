import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, Film, Globe, Layers, Plus, X, 
  ChevronRight, ChevronLeft, Users, Settings, 
  Clock, Clapperboard, Star, Briefcase
} from 'lucide-react';
import { Studio, TeamMember } from '../types';
import { ACTORS, CREW_POOL } from '../data/talent';

interface CreateMovieFormProps {
  studio: Studio;
  onClose: () => void;
  onCreate: (
    title: string, 
    genres: string[], 
    budget: number, 
    universeId?: string, 
    franchiseId?: string,
    scenes?: number,
    runtime?: number,
    castIds?: string[],
    crew?: Record<string, string>
  ) => void;
}

type Step = 'basic' | 'franchise' | 'scenes' | 'casting' | 'crew' | 'review';

export default function CreateMovieForm({ studio, onClose, onCreate }: CreateMovieFormProps) {
  const [step, setStep] = useState<Step>('basic');
  
  // Basic Info
  const [title, setTitle] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  const GENRES = [
    "Action", "Adventure", "Drama", "Comedy", "Romance", 
    "Sci-Fi", "Fantasy", "Horror", "Thriller", "Mystery",
    "Crime", "Historical", "War", "Western", "Animation",
    "Documentary", "Musical", "Superhero", "Sports", "Family"
  ];

  const toggleGenre = (g: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(g)) return prev.filter(x => x !== g);
      if (prev.length >= 3) return prev;
      return [...prev, g];
    });
  };
  
  // Franchise
  const [selectedUniverseId, setSelectedUniverseId] = useState<string>('');
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string>('');
  
  // Scenes & Runtime
  const [scenes, setScenes] = useState(60);
  const estimatedRuntime = useMemo(() => Math.round(scenes * 1.5 + 30), [scenes]);

  // Casting
  const [selectedActorIds, setSelectedActorIds] = useState<string[]>([]);
  
  // Crew
  const [selectedCrew, setSelectedCrew] = useState<Record<string, string>>({});

  const totalCastingCost = useMemo(() => {
    return selectedActorIds.reduce((sum, id) => {
      const actor = ACTORS.find(a => a.id === id);
      return sum + (actor?.salary || 0);
    }, 0);
  }, [selectedActorIds]);

  const totalCrewCost = useMemo(() => {
    return Object.values(selectedCrew).reduce((sum: number, id) => {
      const member = CREW_POOL.find(m => m.name === id); // Using name as ID for mock pool
      return sum + (member?.salary || 0);
    }, 0);
  }, [selectedCrew]);

  const productionBudget = useMemo(() => {
    return scenes * 50000 + 500000; // Base production cost
  }, [scenes]);

  const totalBudget = useMemo(() => {
    return totalCastingCost + totalCrewCost + productionBudget;
  }, [totalCastingCost, totalCrewCost, productionBudget]);

  const canAfford = studio.money >= totalBudget;

  const handleNext = () => {
    const steps: Step[] = ['basic', 'franchise', 'scenes', 'casting', 'crew', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['basic', 'franchise', 'scenes', 'casting', 'crew', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    if (!canAfford) {
      alert("Insufficient funds for this production!");
      return;
    }
    onCreate(
      title, 
      selectedGenres, 
      totalBudget, 
      selectedUniverseId || undefined, 
      selectedFranchiseId || undefined,
      scenes,
      estimatedRuntime,
      selectedActorIds,
      selectedCrew
    );
  };

  const toggleActor = (id: string) => {
    setSelectedActorIds(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const setCrewMember = (role: string, name: string) => {
    setSelectedCrew(prev => ({ ...prev, [role]: name }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.9, y: 20 }} 
        className="relative bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Advanced Production</h2>
              <div className="flex items-center gap-2 mt-1">
                {['basic', 'franchise', 'scenes', 'casting', 'crew', 'review'].map((s, i) => (
                  <div 
                    key={s} 
                    className={`h-1 rounded-full transition-all ${
                      step === s ? 'w-6 bg-indigo-500' : 'w-2 bg-white/10'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-white/40" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {step === 'basic' && (
              <motion.div 
                key="basic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Project Identity</h3>
                  <p className="text-sm text-white/40">Define the core concept of your next blockbuster.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/30 tracking-widest mb-2">Movie Title</label>
                    <input 
                      autoFocus 
                      required 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      placeholder="e.g. Solar Knight" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/10 text-lg font-bold" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/30 tracking-widest mb-2">Genres (Max 3)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {GENRES.map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleGenre(g)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                            selectedGenres.includes(g) 
                              ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                              : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'franchise' && (
              <motion.div 
                key="franchise"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Universe Integration</h3>
                  <p className="text-sm text-white/40">Connect your project to existing worlds or start a new saga.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <label className="block text-[10px] uppercase font-bold text-white/30 tracking-widest mb-4">Select Universe</label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => { setSelectedUniverseId(''); setSelectedFranchiseId(''); }}
                        className={`p-4 rounded-2xl text-left border transition-all ${
                          selectedUniverseId === '' 
                            ? 'bg-indigo-500 border-indigo-500 text-white' 
                            : 'bg-zinc-900 border-white/5 text-white/40'
                        }`}
                      >
                        <div className="font-bold">Standalone Project</div>
                        <div className="text-[10px] opacity-60">No shared continuity</div>
                      </button>
                      {(studio.universes || []).map(u => (
                        <button
                          key={u.id}
                          onClick={() => { setSelectedUniverseId(u.id); setSelectedFranchiseId(''); }}
                          className={`p-4 rounded-2xl text-left border transition-all ${
                            selectedUniverseId === u.id 
                              ? 'bg-indigo-500 border-indigo-500 text-white' 
                              : 'bg-zinc-900 border-white/5 text-white/40'
                          }`}
                        >
                          <div className="font-bold">{u.name}</div>
                          <div className="text-[10px] opacity-60">{u.franchiseIds?.length || 0} Franchises</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedUniverseId && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 p-6 rounded-3xl border border-white/5"
                    >
                      <label className="block text-[10px] uppercase font-bold text-white/30 tracking-widest mb-4">Select Franchise</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedFranchiseId('')}
                          className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                            selectedFranchiseId === '' 
                              ? 'bg-indigo-500 border-indigo-500 text-white' 
                              : 'bg-zinc-900 border-white/5 text-white/40'
                          }`}
                        >
                          None
                        </button>
                        {studio.franchises
                          ?.filter(f => f.universeId === selectedUniverseId)
                          .map(f => (
                            <button
                              key={f.id}
                              onClick={() => setSelectedFranchiseId(f.id)}
                              className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                                selectedFranchiseId === f.id 
                                  ? 'bg-indigo-500 border-indigo-500 text-white' 
                                  : 'bg-zinc-900 border-white/5 text-white/40'
                              }`}
                            >
                              {f.name}
                            </button>
                          ))
                        }
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'scenes' && (
              <motion.div 
                key="scenes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Scene Builder</h3>
                  <p className="text-sm text-white/40">Determine the scale and length of your production.</p>
                </div>

                <div className="space-y-12">
                  <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <Clapperboard className="w-12 h-12 text-indigo-500/20" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <div className="text-4xl font-bold text-white">{scenes}</div>
                          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total Scenes</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-400">{estimatedRuntime}m</div>
                          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Est. Runtime</div>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="120" 
                        value={scenes} 
                        onChange={e => setScenes(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="flex justify-between mt-4 text-[10px] font-bold text-white/20 uppercase">
                        <span>Short Film</span>
                        <span>Feature</span>
                        <span>Epic</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-2 text-indigo-400 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Production Time</span>
                      </div>
                      <div className="text-lg font-bold text-white">{Math.round(scenes / 4)} Weeks</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-2 text-emerald-400 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Base Cost</span>
                      </div>
                      <div className="text-lg font-bold text-white">${(productionBudget / 1000).toFixed(0)}k</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'casting' && (
              <motion.div 
                key="casting"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Casting Call</h3>
                  <p className="text-sm text-white/40">Select the stars that will bring your story to life.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACTORS.map(actor => (
                    <button
                      key={actor.id}
                      onClick={() => toggleActor(actor.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                        selectedActorIds.includes(actor.id)
                          ? 'bg-indigo-500 border-indigo-500 text-white'
                          : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'
                      }`}
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <Star className={`w-6 h-6 ${selectedActorIds.includes(actor.id) ? 'text-white' : 'text-white/20'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm">{actor.name}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] opacity-60">Pop: {actor.popularity}%</span>
                          <span className="text-[10px] font-bold">${(actor.salary / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'crew' && (
              <motion.div 
                key="crew"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Production Crew</h3>
                  <p className="text-sm text-white/40">Assemble a world-class team to execute your vision.</p>
                </div>

                <div className="space-y-4">
                  {[
                    'Director', 'Producer', 'Writer', 'Screenwriter', 'Storyboard Artist',
                    'Cinematographer', 'Editor', 'Lighting Director', 'VFX Supervisor', 'Colorist',
                    'Composer', 'Music Producer', 'Sound Designer',
                    'Casting Director', 'Costume Designer', 'Set Designer', 'Makeup Artist', 'Stunt Coordinator', 'Production Manager'
                  ].map(role => (
                    <div key={role} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <label className="block text-[10px] uppercase font-bold text-white/30 tracking-widest mb-3">{role}</label>
                      <select
                        value={selectedCrew[role] || ''}
                        onChange={e => setCrewMember(role, e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        <option value="">Select Talent...</option>
                        {CREW_POOL.filter(m => m.role === role).map(m => (
                          <option key={m.name} value={m.name}>
                            {m.name} (Skill: {m.skill} • ${(m.salary / 1000).toFixed(0)}k)
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'review' && (
              <motion.div 
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Production Review</h3>
                  <p className="text-sm text-white/40">Finalize the budget and greenlight the production.</p>
                </div>

                <div className="bg-white/5 rounded-[32px] border border-white/5 overflow-hidden">
                  <div className="p-6 bg-indigo-500/10 border-b border-white/5">
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Project Title</div>
                    <div className="text-2xl font-bold text-white">{title || 'Untitled Project'}</div>
                    <div className="text-xs text-white/40 mt-1">{selectedGenres.join(' + ')} • {estimatedRuntime}m • {scenes} Scenes</div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40 font-bold uppercase">Cast & Crew</span>
                      <span className="text-sm font-bold text-white">${((totalCastingCost + totalCrewCost) / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40 font-bold uppercase">Production Costs</span>
                      <span className="text-sm font-bold text-white">${(productionBudget / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="text-sm text-white font-bold uppercase">Total Budget</span>
                      <span className={`text-2xl font-bold ${canAfford ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${(totalBudget / 1000000).toFixed(2)}M
                      </span>
                    </div>
                  </div>
                </div>

                {!canAfford && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold text-center">
                    Warning: Insufficient funds to greenlight this project.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-zinc-900/50 backdrop-blur-xl flex gap-3">
          {step !== 'basic' && (
            <button
              onClick={handleBack}
              className="px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-white/40 hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          
          {step === 'review' ? (
            <button
              onClick={handleSubmit}
              disabled={!canAfford || !title}
              className="flex-1 bg-white text-black px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-30"
            >
              <Plus className="w-4 h-4" />
              Greenlight Production
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={step === 'basic' && (!title || selectedGenres.length === 0)}
              className="flex-1 bg-indigo-500 text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-30"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
