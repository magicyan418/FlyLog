import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { AISettings, FlightRecord } from './types';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useFlightData } from './hooks/useFlightData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAlert } from './hooks/useAlert';
import { MOOD_DISPLAY } from './constants';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { Dashboard } from './components/Dashboard';
import { LogsTable } from './components/LogsTable';
import { SettingsPanel } from './components/SettingsPanel';
import { FlightLogModal } from './components/FlightLogModal';
import { Alert } from './components/Alert';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'settings'>('dashboard');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FlightRecord | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [aiSettings, setAiSettings] = useLocalStorage<AISettings>('captains_ai_settings', {
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4o-mini',
    customInstruction: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { alertState, success, error, info, confirm, closeAlert } = useAlert();

  const {
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
  } = useTheme();

  const {
    records,
    aiInsight,
    isAiLoading,
    addFlight,
    updateFlight,
    deleteRecord,
    fetchInsights,
    clearAllRecords,
    importRecords
  } = useFlightData();

  useEffect(() => {
    fetchInsights(aiSettings);
  }, [records.length, fetchInsights]);

  const handleRefreshInsights = () => {
    fetchInsights(aiSettings);
  };

  const handleSubmitFlight = (flight: { duration: number; mood: any; notes: string; intensity: number; flightDateTime?: string; process?: string }) => {
    if (editingRecord) {
      updateFlight(editingRecord.id, flight);
      setEditingRecord(null);
    } else {
      addFlight(flight);
    }
    setIsLogModalOpen(false);
  };

  const handleDeleteRecord = (id: string) => {
    confirm(
      '确认删除这条飞行记录吗？此操作无法撤销。',
      () => {
        deleteRecord(id);
        success('飞行记录已删除');
      },
      '删除确认'
    );
  };

  const handleEditRecord = (record: FlightRecord) => {
    setEditingRecord(record);
    setIsLogModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLogModalOpen(false);
    setEditingRecord(null);
  };

  const exportToCSV = () => {
    if (records.length === 0) {
      info('尚无记录可导出');
      return;
    }
    
    // 准备数据
    const headers = ['记录ID', '起飞时间', '航程时长(分钟)', '天气状况', '引擎推力', '飞行过程', '航班备注'];
    const rows = records.map(r => [
      r.id,
      new Date(r.timestamp).toLocaleString('zh-CN'),
      r.duration,
      MOOD_DISPLAY[r.mood],
      r.intensity,
      r.process || '',
      r.notes || ''
    ]);
    
    // 创建工作表
    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // 设置列宽（单位：字符宽度）
    ws['!cols'] = [
      { wch: 38 },  // 记录ID
      { wch: 20 },  // 起飞时间
      { wch: 16 },  // 航程时长(分钟)
      { wch: 12 },  // 天气状况
      { wch: 12 },  // 引擎推力
      { wch: 40 },  // 飞行过程
      { wch: 40 }   // 航班备注
    ];
    
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '飞行记录');
    
    // 导出文件
    XLSX.writeFile(wb, `机长飞行日志_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportBackup = () => {
    if (records.length === 0) {
      info('没有数据可以备份');
      return;
    }
    const dataStr = JSON.stringify(records, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `系统备份_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json) && (json.length === 0 || ('id' in json[0] && 'timestamp' in json[0]))) {
          confirm(
            `确认恢复 ${json.length} 条记录？此操作将覆盖当前所有数据。`,
            () => {
              importRecords(json);
              success('数据恢复成功');
            },
            '数据恢复'
          );
        } else {
          error('文件格式不正确，请选择有效的备份文件。');
        }
      } catch (err) {
        error('文件解析失败，请检查文件格式。');
      }
      if (e.target) e.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleSystemReset = () => {
    clearAllRecords();
    setShowClearConfirm(false);
    success('系统已重置，所有数据已清除。');
  };

  return (
    <div className={`min-h-screen pb-20 pt-8 px-4 md:px-8 max-w-6xl mx-auto selection:bg-${primaryColor}-500 selection:text-white transition-colors duration-300`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={importData}
        accept=".json"
        className="hidden"
      />

      <Header primaryColor={primaryColor} onAddFlight={() => setIsLogModalOpen(true)} />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        glassClass={glassClass}
        textMutedClass={textMutedClass}
        primaryColor={primaryColor}
      />

      {activeTab === 'dashboard' && (
        <Dashboard
          records={records}
          aiInsight={aiInsight}
          isAiLoading={isAiLoading}
          onRefreshInsights={handleRefreshInsights}
          glassClass={glassClass}
          textMutedClass={textMutedClass}
          borderMutedClass={borderMutedClass}
          primaryColor={primaryColor}
          themeId={currentTheme}
          isDark={isDark}
        />
      )}

      {activeTab === 'logs' && (
        <LogsTable
          records={records}
          onDeleteRecord={handleDeleteRecord}
          onEditRecord={handleEditRecord}
          glassClass={glassClass}
          textMutedClass={textMutedClass}
          borderMutedClass={borderMutedClass}
          primaryColor={primaryColor}
          isDark={isDark}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsPanel
          themeMode={themeMode}
          currentTheme={currentTheme}
          aiSettings={aiSettings}
          showClearConfirm={showClearConfirm}
          onThemeModeChange={setThemeMode}
          onThemeChange={setCurrentTheme}
          onAiSettingsChange={setAiSettings}
          onExportCSV={exportToCSV}
          onExportBackup={exportBackup}
          onImportClick={handleImportClick}
          onSystemReset={handleSystemReset}
          onClearConfirmToggle={setShowClearConfirm}
          glassClass={glassClass}
          textMutedClass={textMutedClass}
          borderMutedClass={borderMutedClass}
          cardBgClass={cardBgClass}
          primaryColor={primaryColor}
          isDark={isDark}
        />
      )}

      <FlightLogModal
        isOpen={isLogModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitFlight}
        editingRecord={editingRecord}
        glassClass={glassClass}
        textMutedClass={textMutedClass}
        borderMutedClass={borderMutedClass}
        primaryColor={primaryColor}
        isDark={isDark}
      />

      {/* Alert Component */}
      <Alert
        isOpen={alertState.isOpen}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onClose={closeAlert}
        onConfirm={alertState.onConfirm}
        isDark={isDark}
      />

      {/* Persistent Bottom Bar for quick mobile access */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden">
        <button
          onClick={() => setIsLogModalOpen(true)}
          className={`w-16 h-16 rounded-full bg-${primaryColor}-600 text-white flex items-center justify-center shadow-2xl shadow-${primaryColor}-900 border-4 ${
            isDark ? 'border-slate-950' : 'border-white'
          } transition-all`}
        >
          <span className="text-3xl">+</span>
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
