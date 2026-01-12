import React, { createContext, useContext, useEffect } from 'react';
import { AviationTheme, ThemeMode } from '../types';
import { THEMES } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ThemeContextType {
  currentTheme: AviationTheme;
  themeMode: ThemeMode;
  setCurrentTheme: (theme: AviationTheme) => void;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  primaryColor: string;
  glassClass: string;
  textMutedClass: string;
  borderMutedClass: string;
  cardBgClass: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useLocalStorage<AviationTheme>('captains_flight_theme', 'blue');
  const [themeMode, setThemeMode] = useLocalStorage<ThemeMode>('captains_theme_mode', 'dark');

  useEffect(() => {
    if (themeMode === 'light') {
      document.body.classList.remove('bg-slate-950', 'text-slate-50');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    } else {
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
      document.body.classList.add('bg-slate-950', 'text-slate-50');
    }
  }, [themeMode]);

  const isDark = themeMode === 'dark';
  const activeTheme = THEMES.find(t => t.id === currentTheme) || THEMES[0];
  const primaryColor = activeTheme.primary;

  const glassClass = isDark 
    ? "glass border-white/10 bg-slate-900/60 backdrop-blur-xl" 
    : "bg-white/90 border border-slate-200 shadow-xl shadow-slate-200/50 backdrop-blur-xl";
  
  const textMutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const borderMutedClass = isDark ? "border-slate-800" : "border-slate-100";
  const cardBgClass = isDark ? "bg-slate-900/50" : "bg-slate-50";

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeMode,
        setCurrentTheme,
        setThemeMode,
        isDark,
        primaryColor,
        glassClass,
        textMutedClass,
        borderMutedClass,
        cardBgClass
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};