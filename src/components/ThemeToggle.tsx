import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all relative overflow-hidden group"
    >
      <motion.div
        initial={false}
        animate={{ y: theme === 'dark' ? 0 : 40 }}
        className="flex flex-col items-center gap-8"
      >
        <Moon className="w-5 h-5" />
        <Sun className="w-5 h-5" />
      </motion.div>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
