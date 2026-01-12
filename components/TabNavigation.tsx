import React from 'react';

interface TabNavigationProps {
  activeTab: 'dashboard' | 'logs' | 'settings';
  onTabChange: (tab: 'dashboard' | 'logs' | 'settings') => void;
  glassClass: string;
  textMutedClass: string;
  primaryColor: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  glassClass,
  textMutedClass,
  primaryColor
}) => {
  const tabs = [
    { id: 'dashboard' as const, label: '仪表盘' },
    { id: 'logs' as const, label: '飞行日志' },
    { id: 'settings' as const, label: '系统设置' }
  ];

  return (
    <nav className={`flex gap-2 mb-8 ${glassClass} p-1.5 rounded-2xl w-fit`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === tab.id 
              ? `bg-${primaryColor}-600 text-white shadow-lg` 
              : `${textMutedClass} hover:text-${primaryColor}-500`
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};