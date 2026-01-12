
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  subLabel?: string;
  themeColor?: string; // e.g. 'blue', 'emerald'
  isDark?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  icon, 
  trend, 
  subLabel, 
  themeColor = 'blue',
  isDark = true 
}) => {
  const containerClasses = isDark 
    ? "glass border-white/10 bg-slate-900/60" 
    : "bg-white border border-slate-200 shadow-md shadow-slate-200/40";

  return (
    <div className={`${containerClasses} p-5 rounded-2xl flex flex-col justify-between group hover:border-${themeColor}-500/50 transition-all duration-300 backdrop-blur-xl`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 bg-${themeColor}-500/10 rounded-lg text-${themeColor}-600 dark:text-${themeColor}-400 group-hover:bg-${themeColor}-500/20 transition-colors`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold mt-1 mono tracking-tight text-slate-900 dark:text-white transition-colors">{value}</h3>
        {subLabel && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subLabel}</p>}
      </div>
    </div>
  );
};
