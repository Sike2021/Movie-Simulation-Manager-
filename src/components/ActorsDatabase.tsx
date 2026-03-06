import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Search, Star, Award, TrendingUp, Heart, Filter, User, UserCheck } from 'lucide-react';
import { Actor } from '../types';
import { ACTORS } from '../data/talent';

export default function ActorsDatabase() {
  const [activeTab, setActiveTab] = useState<'actors' | 'actresses' | 'search'>('actors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);

  const filteredActors = useMemo(() => {
    let list = ACTORS;
    
    if (activeTab === 'actors') {
      list = list.filter(a => a.gender === 'Male');
    } else if (activeTab === 'actresses') {
      list = list.filter(a => a.gender === 'Female');
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter(a => 
        a.name.toLowerCase().includes(query) || 
        a.genreSpecialization.some(g => g.toLowerCase().includes(query))
      );
    }

    return list;
  }, [activeTab, searchQuery]);

  const selectedActor = useMemo(() => 
    ACTORS.find(a => a.id === selectedActorId), 
    [selectedActorId]
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Talent Database</h1>
          <p className="text-white/40 mt-1">Browse and analyze the industry's most prominent stars.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 w-fit">
          {[
            { id: 'actors', label: 'Actors', icon: User },
            { id: 'actresses', label: 'Actresses', icon: UserCheck },
            { id: 'search', label: 'Search', icon: Search },
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
      </div>

      {/* Search Bar (Only in Search Tab) */}
      <AnimatePresence>
        {activeTab === 'search' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, genre, or attribute..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/10 text-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actors List */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {filteredActors.map((actor, index) => (
            <motion.button
              key={actor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => setSelectedActorId(actor.id)}
              className={`p-6 rounded-[32px] border text-left transition-all relative overflow-hidden group ${
                selectedActorId === actor.id
                  ? 'bg-indigo-500 border-indigo-500 text-white'
                  : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'
              }`}
            >
              <div className="relative z-10 flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 ${selectedActorId === actor.id ? 'border-white/20' : 'border-white/5'}`}>
                  <img 
                    src={`https://picsum.photos/seed/${actor.id}/100/100`} 
                    alt={actor.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-tight">{actor.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase opacity-60">{actor.age} Years</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-20" />
                    <span className="text-[10px] font-bold uppercase opacity-60">{actor.genreSpecialization[0]}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold">{actor.popularity}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
          
          {filteredActors.length === 0 && (
            <div className="col-span-full p-20 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center">
              <Users className="w-16 h-16 text-white/5 mb-4" />
              <p className="text-white/20 text-lg font-bold">No talent matches your criteria.</p>
            </div>
          )}
        </div>

        {/* Actor Details Sidebar */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedActor ? (
              <motion.div 
                key={selectedActor.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-8 sticky top-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white/10 mx-auto shadow-2xl">
                    <img 
                      src={`https://picsum.photos/seed/${selectedActor.id}/200/200`} 
                      alt={selectedActor.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedActor.name}</h2>
                    <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest mt-1">A-List Talent</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Acting Skill</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-xl font-bold text-white">{selectedActor.actingSkill}</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Fanbase</p>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span className="text-xl font-bold text-white">{(selectedActor.fanbase / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-3">Specializations</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedActor.genreSpecialization.map(genre => (
                        <span key={genre} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-3">Awards & Honors</p>
                    <div className="space-y-2">
                      {selectedActor.awards.length > 0 ? (
                        selectedActor.awards.map(award => (
                          <div key={award} className="flex items-center gap-3 text-sm text-white/60">
                            <Award className="w-4 h-4 text-amber-400" />
                            {award}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-white/20 italic">No major awards yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Asking Salary</p>
                      <p className="text-3xl font-bold text-emerald-400">${(selectedActor.salary / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${selectedActor.availability ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {selectedActor.availability ? 'Available' : 'On Set'}
                    </div>
                  </div>
                  <button className="w-full py-4 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
                    Contact Agent
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/5 rounded-[40px] border border-white/5 border-dashed">
                <Filter className="w-16 h-16 text-white/5 mb-6" />
                <h3 className="text-xl font-bold text-white/20">Select talent to view profile</h3>
                <p className="text-white/10 text-sm mt-2 max-w-xs">Analyze stats, skills, and market value before making an offer.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
