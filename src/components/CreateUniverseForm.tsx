import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, X, Plus } from 'lucide-react';

interface CreateUniverseFormProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function CreateUniverseForm({ onClose, onCreate }: CreateUniverseFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-white/60 backdrop-blur-md" />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white border border-zinc-100 w-full max-w-md rounded-[32px] shadow-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold tracking-tight text-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D1E3FF] rounded-xl flex items-center justify-center text-[#2B59C3]">
              <Globe className="w-5 h-5" />
            </div>
            New Universe
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-2">Universe Name</label>
            <input autoFocus required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. SolarVerse" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-3 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/20 focus:border-[#2B59C3] transition-all placeholder:text-zinc-300 font-bold" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-[#2B59C3] text-white px-4 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
