import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeSwitch = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-all shadow-sm hover:scale-105"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="w-5 h-5 text-sky-600 transition-transform rotate-0 scale-100" />
      )}
    </button>
  );
};
