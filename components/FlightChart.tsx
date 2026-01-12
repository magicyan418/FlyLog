import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Icons } from '../constants';
import { FlightRecord } from '../types';

interface FlightChartProps {
  records: FlightRecord[];
  glassClass: string;
  textMutedClass: string;
  borderMutedClass: string;
  isDark: boolean;
  themeId: string;
}

export const FlightChart: React.FC<FlightChartProps> = ({
  records,
  glassClass,
  textMutedClass,
  borderMutedClass,
  isDark,
  themeId
}) => {
  const chartData = records.slice(0, 7).reverse().map(r => ({
    name: new Date(r.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
    duration: r.duration,
  }));

  const getThemeColor = () => {
    switch(themeId) {
      case 'amber': return '#f59e0b';
      case 'emerald': return '#10b981';
      case 'rose': return '#f43f5e';
      case 'violet': return '#8b5cf6';
      default: return '#3b82f6';
    }
  };

  const themeColor = getThemeColor();

  return (
    <div className={`lg:col-span-2 ${glassClass} rounded-3xl p-6`}>
      <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        <Icons.TrendingUp /> 飞行强度分析
      </h3>
      <div className="h-[300px] w-full">
        {records.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTheme" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke={isDark ? "#94a3b8" : "#64748b"} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke={isDark ? "#94a3b8" : "#64748b"} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, 
                  borderRadius: '12px', 
                  color: isDark ? '#f8fafc' : '#0f172a' 
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="duration" 
                stroke={themeColor} 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorTheme)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className={`h-full flex items-center justify-center ${textMutedClass} border border-dashed ${borderMutedClass} rounded-2xl`}>
            等待数据同步...
          </div>
        )}
      </div>
    </div>
  );
};