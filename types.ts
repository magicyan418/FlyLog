
export type FlightMood = 'Clear Skies' | 'Cloudy' | 'Turbulence' | 'Stormy' | 'Night Flight';

export type AviationTheme = 'blue' | 'emerald' | 'amber' | 'violet' | 'rose';

export type ThemeMode = 'dark' | 'light';

export interface FlightRecord {
  id: string;
  timestamp: number;
  duration: number; // in minutes
  mood: FlightMood;
  notes: string;
  intensity: number; // 1-5
}

export interface AISettings {
  model: 'gemini-3-flash-preview' | 'gemini-3-pro-preview';
  thinkingBudget: number; // 0 to 32768
  customInstruction: string;
}

export interface AIInsight {
  title: string;
  content: string;
  suggestion: string;
}
