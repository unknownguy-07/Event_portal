import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

/**
 * ThemeToggle
 * Sun icon in dark mode, Moon icon in light mode.
 * 40px touch target, persists via ThemeContext.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex items-center justify-center rounded-full"
      style={{
        width: '40px',
        height: '40px',
        backgroundColor: 'var(--bg-hover)',
        color: 'var(--text-secondary)',
        transition: 'background-color var(--transition-base), color var(--transition-base)',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
