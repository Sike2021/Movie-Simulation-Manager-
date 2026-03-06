import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, DollarSign, CheckCircle2, ChevronRight, ChevronLeft, Upload, Building2 } from 'lucide-react';
import { Studio } from '../types';

interface StudioSetupProps {
  onComplete: (setupData: { name: string; logo: string; budget: number }) => void;
}

const BUDGET_OPTIONS = [
  { id: 'indie', name: 'Small Indie Studio', amount: 50000000, description: 'Tight budget, high creative freedom.', color: 'bg-emerald-500' },
  { id: 'small', name: 'Small Studio', amount: 100000000, description: 'A solid foundation for growth.', color: 'bg-blue-500' },
  { id: 'medium', name: 'Medium Studio', amount: 200000000, description: 'Ready to compete with the big players.', color: 'bg-indigo-500' },
  { id: 'large', name: 'Large Studio', amount: 300000000, description: 'Significant resources for blockbusters.', color: 'bg-purple-500' },
  { id: 'mega', name: 'Mega Studio', amount: 500000000, description: 'Unlimited potential. Dominate the industry.', color: 'bg-amber-500' },
];

export default function StudioSetup({ onComplete }: StudioSetupProps) {
  const [step, setStep] = useState<'setup' | 'budget' | 'confirm'>('setup');
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('https://picsum.photos/seed/studio/200/200');
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_OPTIONS[1]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const steps = ['setup', 'budget', 'confirm'];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0%,transparent_50%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Studio Initialization</h2>
              <div className="flex items-center gap-2 mt-1">
                {steps.map((s, i) => (
                  <div 
                    key={s} 
                    className={`h-1 rounded-full transition-all ${
                      step === s ? 'w-8 bg-indigo-500' : i < currentStepIndex ? 'w-4 bg-indigo-500/40' : 'w-2 bg-white/10'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 'setup' && (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Studio Identity</h3>
                  <p className="text-white/40">Give your studio a name and a visual brand.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[32px] overflow-hidden border-2 border-white/10 bg-white/5 flex items-center justify-center group-hover:border-indigo-500 transition-all">
                      {logo ? (
                        <img src={logo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Camera className="w-8 h-8 text-white/20" />
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg">
                      <Upload className="w-5 h-5 text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                  </div>

                  <div className="flex-1 w-full space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/30 tracking-widest mb-2">Studio Name</label>
                      <input 
                        autoFocus
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="e.g. Paramount Pictures" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/10 text-xl font-bold" 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'budget' && (
              <motion.div 
                key="budget"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Starting Purse</h3>
                  <p className="text-white/40">Select your initial funding. This determines your starting difficulty.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {BUDGET_OPTIONS.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedBudget(option)}
                      className={`p-5 rounded-3xl border text-left transition-all flex items-center gap-6 ${
                        selectedBudget.id === option.id 
                          ? 'bg-indigo-500 border-indigo-500 text-white shadow-xl shadow-indigo-500/20' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl ${option.color} flex items-center justify-center text-white shadow-inner`}>
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg">{option.name}</div>
                        <div className="text-xs opacity-60">{option.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">${(option.amount / 1000000).toFixed(0)}M</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'confirm' && (
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-emerald-500/20 rounded-[32px] flex items-center justify-center text-emerald-500 mb-4">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-white">Ready to Launch?</h3>
                  <p className="text-white/40 max-w-sm">Your studio is configured and ready to begin its journey to cinematic greatness.</p>
                </div>

                <div className="w-full bg-white/5 p-8 rounded-[40px] border border-white/10 space-y-6">
                  <div className="flex items-center gap-6">
                    <img src={logo} alt="Logo" className="w-20 h-20 rounded-2xl object-cover border border-white/10" referrerPolicy="no-referrer" />
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Studio Name</div>
                      <div className="text-2xl font-bold text-white">{name || 'Untitled Studio'}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5 text-left">
                      <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Initial Budget</div>
                      <div className="text-xl font-bold text-emerald-400">${(selectedBudget.amount / 1000000).toFixed(0)}M</div>
                    </div>
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5 text-left">
                      <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Starting Prestige</div>
                      <div className="text-xl font-bold text-indigo-400">10.0</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-zinc-900/50 backdrop-blur-xl flex gap-4">
          {step !== 'setup' && (
            <button
              onClick={() => setStep(steps[currentStepIndex - 1] as any)}
              className="px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-white/40 hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          
          <button
            onClick={() => {
              if (step === 'confirm') {
                onComplete({ name, logo, budget: selectedBudget.amount });
              } else {
                setStep(steps[currentStepIndex + 1] as any);
              }
            }}
            disabled={step === 'setup' && !name}
            className="flex-1 bg-white text-black px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-30"
          >
            {step === 'confirm' ? 'Begin Career' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
