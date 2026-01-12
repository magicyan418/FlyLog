
export type FlightMood = 'Clear Skies' | 'Cloudy' | 'Turbulence' | 'Stormy' | 'Night Flight';

export type AviationTheme = 'blue' | 'emerald' | 'amber' | 'violet' | 'rose';

export type ThemeMode = 'dark' | 'light';

export interface FlightRecord {
  id: string;
  timestamp: number;
  flightTime?: string; // 飞行时间 HH:mm 格式
  duration: number; // in minutes
  mood: FlightMood;
  notes: string;
  process?: string; // 飞行过程描述
  intensity: number; // 1-5
}

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'custom';

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  baseURL?: string; // 自定义 URL（用于 custom 或代理）
  model: string;
  customInstruction: string;
}

export interface AIInsight {
  title: string;
  content: string;
  suggestion: string;
}
