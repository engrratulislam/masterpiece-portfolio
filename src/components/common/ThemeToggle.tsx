'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Show a neutral state until hydrated
  if (!isHydrated) {
    return (
      <button
        className="p-2 sm:p-3 glass-modern rounded-full hover:scale-110 transition-all"
        aria-label="Toggle theme"
      >
        <div className="h-5 w-5 sm:h-6 sm:w-6" /> {/* Placeholder to maintain layout */}
      </button>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative p-2 sm:p-3 glass-modern rounded-full hover:scale-110 transition-all group overflow-hidden"
      whileHover={{ rotate: 180 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent-cool to-accent-warm opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"
        initial={false}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Icon */}
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-accent-gold relative z-10" />
        ) : (
          <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-accent-cool relative z-10" />
        )}
      </motion.div>
    </motion.button>
  );
}