import React from 'react';
import { FlightRecord, AIInsight } from '../types';
import { Icons } from '../constants';
import { StatsCard } from '../StatsCard';
import { FlightChart } from './FlightChart';
import { AIInsightPanel } from './AIInsightPanel';

interface DashboardProps {
  records: FlightRecord[];
  aiInsight: AIInsight | null;
  isAiLoading: boolean;
  onRefreshInsights?: () => void;
  glassClass: string;
  textMutedClass: string;
  borderMutedClass: string;
  primaryColor: string;
  themeId: string;
  isDark: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  records,
  aiInsight,
  isAiLoading,
  onRefreshInsights,
  glassClass,
  textMutedClass,
  borderMutedClass,
  primaryColor,
  themeId,
  isDark
}) => {
  const totalFlights = records.length;
  const avgDuration = totalFlights > 0
    ? Math.round(records.reduce((acc, r) => acc + r.duration, 0) / totalFlights)
    : 0;
  const lastFlightDate = records.length > 0
    ? new Date(records[0].timestamp).toLocaleDateString('zh-CN')
    : '暂无数据';
  
  // 计算本周飞行次数
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const weekFlights = records.filter(r => new Date(r.timestamp) >= weekStart).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          label="总计起飞"
          subLabel="机长飞行总数" 
          value={totalFlights} 
          icon={<Icons.Activity />} 
          trend={totalFlights > 5 ? "+12%" : undefined} 
          themeColor={primaryColor} 
          isDark={isDark} 
        />
        <StatsCard 
          label="平均航程" 
          value={`${avgDuration} 分钟`} 
          icon={<Icons.Log />} 
          subLabel="历史飞行均值" 
          themeColor={primaryColor} 
          isDark={isDark} 
        />
        <StatsCard
          label="本周飞行"
          value={`${weekFlights} 次`}
          icon={<Icons.TrendingUp />}
          subLabel="本周起飞统计"
          themeColor={primaryColor}
          isDark={isDark}
        />
        <StatsCard
          label="最近起飞"
          value={lastFlightDate}
          icon={<Icons.Calendar />}
          subLabel="上次飞行日期"
          themeColor={primaryColor}
          isDark={isDark}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FlightChart
          records={records}
          glassClass={glassClass}
          textMutedClass={textMutedClass}
          borderMutedClass={borderMutedClass}
          isDark={isDark}
          themeId={themeId}
        />
        <AIInsightPanel
          aiInsight={aiInsight}
          isAiLoading={isAiLoading}
          onRefresh={onRefreshInsights}
          glassClass={glassClass}
          textMutedClass={textMutedClass}
          primaryColor={primaryColor}
          isDark={isDark}
        />
      </div>
    </div>
  );
};