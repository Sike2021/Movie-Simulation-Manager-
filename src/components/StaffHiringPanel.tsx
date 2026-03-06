import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Star, Award, TrendingUp, 
  Briefcase, Filter, UserPlus, Clock, 
  Zap, ShieldCheck, Music, Settings, PenTool,
  Camera, Film, Layout, Palette, Headphones,
  UserCheck, DollarSign
} from 'lucide-react';
import { TeamMember, StaffRole, Studio } from '../types';
import { CREW_POOL } from '../data/talent';

interface StaffHiringPanelProps {
  studio: Studio;
  onHire: (member: TeamMember) => void;
}

export default function StaffHiringPanel({ studio, onHire }: StaffHiringPanelProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'creative' | 'technical' | 'music' | 'production'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const CATEGORIES = {
    creative: ["Director", "Producer", "Writer", "Screenwriter", "Storyboard Artist"],
    technical: ["Cinematographer", "Editor", "Lighting Director", "VFX Supervisor", "Colorist"],
    music: ["Composer", "Music Producer", "Sound Designer"],
    production: ["Casting Director", "Costume Designer", "Set Designer", "Makeup Artist", "Stunt Coordinator", "Production Manager"]
  };

  const filteredStaff = useMemo(() => {
    let list = CREW_POOL;
    
    if (activeTab !== 'all') {
      const roles = CATEGORIES[activeTab as keyof typeof CATEGORIES];
      list = list.filter(s => roles.includes(s.role));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.role.toLowerCase().includes(query)
      );
    }

    return list;
  }, [activeTab, searchQuery]);

  const selectedStaff = useMemo(() => 
    CREW_POOL.find(s => s.name === selectedStaffId), 
    [selectedStaffId]
  );

  const isAlreadyHired = (name: string) => {
    return studio.staff.some(s => s.name === name);
  };

  const handleHire = (member: Omit<TeamMember, "id" | "contractType">) => {
    const newMember: TeamMember = {
      ...member,
      id: Math.random().toString(36).substr(2, 9),
      contractType: "Single",
      moviesRemaining: 1
    };
    onHire(newMember);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Staff Recruitment</h1>
          <p className="text-white/40 mt-1">Hire industry professionals to boost your production quality.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto custom-scrollbar">
          {[
            { id: 'all', label: 'All', icon: Users },
            { id: 'creative', label: 'Creative', icon: PenTool },
            { id: 'technical', label: 'Technical', icon: Camera },
            { id: 'music', label: 'Music', icon: Music },
            { id: 'production', label: 'Production', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
        <input 
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by name or role..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/10 text-lg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Staff List */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {filteredStaff.map((member, index) => {
            const hired = isAlreadyHired(member.name);
            return (
              <motion.button
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => setSelectedStaffId(member.name)}
                className={`p-6 rounded-[32px] border text-left transition-all relative overflow-hidden group ${
                  selectedStaffId === member.name
                    ? 'bg-indigo-500 border-indigo-500 text-white'
                    : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'
                }`}
              >
                <div className="relative z-10 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border-2 ${selectedStaffId === member.name ? 'border-white/20' : 'border-white/5'}`}>
                    <Briefcase className={`w-6 h-6 ${selectedStaffId === member.name ? 'text-white' : 'text-white/20'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base leading-tight">{member.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold uppercase opacity-60">{member.role}</span>
                      {hired && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold rounded uppercase">Hired</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-bold">{member.skill}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Staff Details Sidebar */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedStaff ? (
              <motion.div 
                key={selectedStaff.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-8 sticky top-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 rounded-[32px] bg-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto shadow-2xl">
                    <UserCheck className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedStaff.name}</h2>
                    <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mt-1">{selectedStaff.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Experience</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-lg font-bold text-white">{selectedStaff.experience}y</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Popularity</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span className="text-lg font-bold text-white">{selectedStaff.popularity}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Modifiers</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          Speed Bonus
                        </div>
                        <span className="text-xs font-bold text-amber-400">+{Math.round(selectedStaff.speedModifier * 100)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Quality Bonus
                        </div>
                        <span className="text-xs font-bold text-emerald-400">+{Math.round(selectedStaff.qualityModifier * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Weekly Salary</p>
                      <p className="text-3xl font-bold text-emerald-400">${(selectedStaff.salary / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                  
                  {isAlreadyHired(selectedStaff.name) ? (
                    <div className="w-full py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold text-xs uppercase tracking-widest text-center">
                      Already on Staff
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleHire(selectedStaff)}
                      disabled={studio.money < selectedStaff.salary}
                      className="w-full py-4 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-30"
                    >
                      Hire Professional
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/5 rounded-[40px] border border-white/5 border-dashed">
                <Filter className="w-16 h-16 text-white/5 mb-6" />
                <h3 className="text-xl font-bold text-white/20">Select staff to view profile</h3>
                <p className="text-white/10 text-sm mt-2 max-w-xs">Analyze modifiers and experience before signing a contract.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
