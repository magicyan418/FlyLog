import React from 'react';
import { AIInsight } from '../types';

interface AIInsightPanelProps {
  aiInsight: AIInsight | null;
  isAiLoading: boolean;
  onRefresh?: () => void;
  glassClass: string;
  textMutedClass: string;
  primaryColor: string;
  isDark: boolean;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({
  aiInsight,
  isAiLoading,
  onRefresh,
  glassClass,
  textMutedClass,
  primaryColor,
  isDark
}) => {
  return (
    <div className={`${glassClass} rounded-3xl p-6 border-l-4 border-${primaryColor}-500 relative overflow-hidden transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          <span className={`w-2 h-2 rounded-full bg-${primaryColor}-500 animate-pulse`}></span>
          飞行智能情报
        </h3>
        {aiInsight && onRefresh && !isAiLoading && (
          <button
            onClick={onRefresh}
            className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} ${textMutedClass} hover:text-${primaryColor}-500`}
            title="刷新情报"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </button>
        )}
      </div>
      {isAiLoading ? (
        <div className="space-y-4">
          <div className={`h-4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded animate-pulse w-3/4`}></div>
          <div className={`h-20 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded animate-pulse`}></div>
        </div>
      ) : aiInsight ? (
        <div className="space-y-4">
          <p className={`text-${primaryColor}-600 dark:text-${primaryColor}-400 font-bold mono text-sm`}>
            {aiInsight.title}
          </p>
          <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} text-sm leading-relaxed`}>
            {aiInsight.content}
          </p>
          <div className={`bg-${primaryColor}-500/10 p-4 rounded-2xl`}>
            <p className={`text-xs font-bold text-${primaryColor}-600 dark:text-${primaryColor}-400 uppercase tracking-tighter mb-1`}>
              机长建议
            </p>
            <p className={`text-xs ${textMutedClass} italic`}>
              "{aiInsight.suggestion}"
            </p>
          </div>
        </div>
      ) : (
        <p className={`${textMutedClass} text-sm`}>
          记录 3 次以上飞行，获取 AI 深度情报。
        </p>
      )}
    </div>
  );
};