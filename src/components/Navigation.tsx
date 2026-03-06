import React from 'react';
import { Home, Clapperboard, Megaphone, Trophy, BarChart3, User, Film, Globe, Calendar, Users } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Screen = 'home' | 'production' | 'marketing' | 'distribution' | 'stats' | 'profile' | 'library' | 'universes' | 'rankings' | 'economy' | 'calendar' | 'release' | 'festivals' | 'actors' | 'staff';

interface NavigationProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function Navigation({ activeScreen, onNavigate }: NavigationProps) {
  const navItems: { id: Screen; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'production', label: 'Studio', icon: Clapperboard },
    { id: 'actors', label: 'Actors', icon: User },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'economy', label: 'Economy', icon: BarChart3 },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'festivals', label: 'Festivals', icon: Trophy },
    { id: 'distribution', label: 'Awards', icon: Trophy },
    { id: 'release', label: 'Release', icon: Film },
    { id: 'calendar', label: 'Events', icon: Calendar },
    { id: 'rankings', label: 'Rankings', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-xl border-t border-white/5 px-6 py-3 flex items-center justify-between z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all flex-1",
              isActive ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all",
              isActive ? "bg-indigo-500/20" : "bg-transparent"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
