
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FlightRecord, FlightMood, AIInsight, AviationTheme, ThemeMode, AISettings } from './types';
import { Icons, MOOD_COLORS, MOOD_DISPLAY, THEMES } from './constants';
import { StatsCard } from './StatsCard';
import { getFlightInsights } from './services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [records, setRecords] = useState<FlightRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'settings'>('dashboard');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<AviationTheme>('blue');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [aiSettings, setAiSettings] = useState<AISettings>({
    model: 'gemini-3-flash-preview',
    thinkingBudget: 0,
    customInstruction: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load configuration
  useEffect(() => {
    const savedRecords = localStorage.getItem('captains_flight_log');
    if (savedRecords) {
      try {
        const parsed = JSON.parse(savedRecords);
        if (Array.isArray(parsed)) setRecords(parsed);
      } catch (e) { console.error(e); }
    }
    
    const savedTheme = localStorage.getItem('captains_flight_theme') as AviationTheme;
    if (savedTheme && THEMES.some(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
    }

    const savedMode = localStorage.getItem('captains_theme_mode') as ThemeMode;
    if (savedMode === 'light' || savedMode === 'dark') {
      setThemeMode(savedMode);
    }

    const savedAiSettings = localStorage.getItem('captains_ai_settings');
    if (savedAiSettings) {
      try {
        setAiSettings(JSON.parse(savedAiSettings));
      } catch (e) { console.error(e); }
    }
  }, []);

  // Persistence effects
  useEffect(() => {
    if (records.length > 0) localStorage.setItem('captains_flight_log', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('captains_flight_theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('captains_theme_mode', themeMode);
    if (themeMode === 'light') {
      document.body.classList.remove('bg-slate-950');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    } else {
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
      document.body.classList.add('bg-slate-950', 'text-slate-50');
    }
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('captains_ai_settings', JSON.stringify(aiSettings));
  }, [aiSettings]);

  const fetchInsights = useCallback(async () => {
    if (records.length >= 3) {
      setIsAiLoading(true);
      try {
        const insight = await getFlightInsights(records, aiSettings);
        if (insight) setAiInsight(insight);
      } catch (e) { console.error(e); }
      finally { setIsAiLoading(false); }
    }
  }, [records.length, aiSettings]);

  useEffect(() => { fetchInsights(); }, [records.length]);

  const handleAddFlight = (e: React.FormEvent) => {
    e.preventDefault();
    const flight: FlightRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...newFlight,
    };
    setRecords([flight, ...records]);
    setIsLogModalOpen(false);
    setNewFlight({ duration: 15, mood: 'Clear Skies', notes: '', intensity: 3 });
  };

  const deleteRecord = (id: string) => {
    if (window.confirm('确认删除这条飞行记录吗？')) {
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      if (updated.length === 0) localStorage.removeItem('captains_flight_log');
    }
  };

  const exportToCSV = () => {
    if (records.length === 0) { alert('尚无记录可导出'); return; }
    const headers = ['记录ID', '飞行时间', '持续时长(分钟)', '天气状况', '引擎强度', '备注'];
    const rows = records.map(r => [r.id, new Date(r.timestamp).toLocaleString('zh-CN'), r.duration, MOOD_DISPLAY[r.mood], r.intensity, `"${(r.notes || '').replace(/"/g, '""')}"`]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `机长飞行日志_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(url); }, 100);
  };

  const exportBackup = () => {
    if (records.length === 0) { alert('没有数据可以备份'); return; }
    const dataStr = JSON.stringify(records, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `系统备份_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(url); }, 100);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json) && (json.length === 0 || ('id' in json[0] && 'timestamp' in json[0]))) {
          if (window.confirm(`确认恢复 ${json.length} 条记录？`)) {
            setRecords(json);
            localStorage.setItem('captains_flight_log', JSON.stringify(json));
          }
        } else { alert('文件格式不正确'); }
      } catch (err) { alert('解析失败'); }
      if (e.target) e.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleSystemReset = () => {
    setRecords([]);
    setAiInsight(null);
    localStorage.removeItem('captains_flight_log');
    setShowClearConfirm(false);
    alert('系统已重置');
  };

  const isDark = themeMode === 'dark';
  const glassClass = isDark 
    ? "glass border-white/10 bg-slate-900/60 backdrop-blur-xl" 
    : "bg-white/90 border border-slate-200 shadow-xl shadow-slate-200/50 backdrop-blur-xl";
  const textMutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const borderMutedClass = isDark ? "border-slate-800" : "border-slate-100";
  const cardBgClass = isDark ? "bg-slate-900/50" : "bg-slate-50";

  const activeTheme = THEMES.find(t => t.id === currentTheme) || THEMES[0];
  const primaryColor = activeTheme.primary;
  
  const totalFlights = records.length;
  const avgDuration = totalFlights > 0 ? Math.round(records.reduce((acc, r) => acc + r.duration, 0) / totalFlights) : 0;
  const lastFlightDate = records.length > 0 ? new Date(records[0].timestamp).toLocaleDateString('zh-CN') : '暂无数据';
  const streak = Math.min(records.length, 7);

  const chartData = records.slice(0, 7).reverse().map(r => ({
    name: new Date(r.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
    duration: r.duration,
  }));

  const [newFlight, setNewFlight] = useState<{ duration: number; mood: FlightMood; notes: string; intensity: number; }>({
    duration: 15, mood: 'Clear Skies', notes: '', intensity: 3,
  });

  return (
    <div className={`min-h-screen pb-20 pt-8 px-4 md:px-8 max-w-6xl mx-auto selection:bg-${primaryColor}-500 selection:text-white transition-colors duration-300`}>
      <input type="file" ref={fileInputRef} onChange={importData} accept=".json" className="hidden" />

      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <div className={`flex items-center gap-2 text-${primaryColor}-500 mb-1 transition-colors duration-500`}>
            <Icons.Plane />
            <span className="font-bold tracking-widest text-xs uppercase mono">飞行控制中心 (TCC)</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">机长日志</h1>
        </div>
        <button 
          onClick={() => setIsLogModalOpen(true)}
          className={`bg-${primaryColor}-600 hover:bg-${primaryColor}-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-${primaryColor}-900/20 flex items-center gap-2`}
        >
          <span className="text-xl leading-none">+</span> 新增飞行
        </button>
      </header>

      {/* Tabs */}
      <nav className={`flex gap-2 mb-8 ${glassClass} p-1.5 rounded-2xl w-fit`}>
        {(['dashboard', 'logs', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab 
                ? `bg-${primaryColor}-600 text-white shadow-lg` 
                : `${textMutedClass} hover:text-${primaryColor}-500`
            }`}
          >
            {{ dashboard: '仪表盘', logs: '飞行日志', settings: '系统设置' }[tab]}
          </button>
        ))}
      </nav>

      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="总计起飞" value={totalFlights} icon={<Icons.Activity />} trend={totalFlights > 5 ? "+12%" : undefined} themeColor={primaryColor} isDark={isDark} />
            <StatsCard label="平均航程" value={`${avgDuration} 分钟`} icon={<Icons.Log />} subLabel="历史飞行均值" themeColor={primaryColor} isDark={isDark} />
            <StatsCard label="连胜记录" value={`${streak} 天`} icon={<Icons.TrendingUp />} trend="稳定" themeColor={primaryColor} isDark={isDark} />
            <StatsCard label="最近离港" value={lastFlightDate} icon={<Icons.Calendar />} themeColor={primaryColor} isDark={isDark} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 ${glassClass} rounded-3xl p-6`}>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Icons.TrendingUp /> 飞行强度分析
              </h3>
              <div className="h-[300px] w-full">
                {records.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorTheme" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={activeTheme.id === 'amber' ? '#f59e0b' : activeTheme.id === 'emerald' ? '#10b981' : activeTheme.id === 'rose' ? '#f43f5e' : activeTheme.id === 'violet' ? '#8b5cf6' : '#3b82f6'} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={activeTheme.id === 'amber' ? '#f59e0b' : activeTheme.id === 'emerald' ? '#10b981' : activeTheme.id === 'rose' ? '#f43f5e' : activeTheme.id === 'violet' ? '#8b5cf6' : '#3b82f6'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', color: isDark ? '#f8fafc' : '#0f172a' }} />
                      <Area type="monotone" dataKey="duration" stroke={activeTheme.id === 'amber' ? '#f59e0b' : activeTheme.id === 'emerald' ? '#10b981' : activeTheme.id === 'rose' ? '#f43f5e' : activeTheme.id === 'violet' ? '#8b5cf6' : '#3b82f6'} strokeWidth={3} fillOpacity={1} fill="url(#colorTheme)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className={`h-full flex items-center justify-center ${textMutedClass} border border-dashed ${borderMutedClass} rounded-2xl`}>等待数据同步...</div>
                )}
              </div>
            </div>

            <div className={`${glassClass} rounded-3xl p-6 border-l-4 border-${primaryColor}-500 relative overflow-hidden transition-all`}>
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full bg-${primaryColor}-500 animate-pulse`}></span>
                 飞行智能情报
               </h3>
               {isAiLoading ? (
                 <div className="space-y-4">
                   <div className={`h-4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded animate-pulse w-3/4`}></div>
                   <div className={`h-20 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded animate-pulse`}></div>
                 </div>
               ) : aiInsight ? (
                 <div className="space-y-4">
                    <p className={`text-${primaryColor}-600 font-bold mono text-sm`}>{aiInsight.title}</p>
                    <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} text-sm leading-relaxed`}>{aiInsight.content}</p>
                    <div className={`bg-${primaryColor}-500/10 p-4 rounded-2xl`}>
                      <p className={`text-xs font-bold text-${primaryColor}-600 uppercase tracking-tighter mb-1`}>机长建议</p>
                      <p className={`text-xs ${textMutedClass} italic`}>“{aiInsight.suggestion}”</p>
                    </div>
                 </div>
               ) : (
                 <p className={`${textMutedClass} text-sm`}>记录 3 次以上飞行，获取 AI 深度情报。</p>
               )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className={`${glassClass} rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4`}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} ${textMutedClass} text-xs font-bold uppercase tracking-widest border-b ${borderMutedClass}`}>
                <th className="px-6 py-4">时间</th>
                <th className="px-6 py-4">时长</th>
                <th className="px-6 py-4">天气</th>
                <th className="px-6 py-4">推力</th>
                <th className="px-6 py-4 text-right">管理</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${borderMutedClass}`}>
              {records.length === 0 ? (
                <tr><td colSpan={5} className={`px-6 py-20 text-center ${textMutedClass}`}>尚无飞行历史记录。</td></tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-blue-500/5 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium">{new Date(record.timestamp).toLocaleString('zh-CN')}</td>
                    <td className="px-6 py-4">
                      <span className={`mono text-${primaryColor}-600 bg-${primaryColor}-500/10 px-2 py-1 rounded text-xs font-bold`}>{record.duration} 分钟</span>
                    </td>
                    <td className="px-6 py-4 text-sm"><span className={MOOD_COLORS[record.mood]}>{MOOD_DISPLAY[record.mood]}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className={`w-1.5 h-4 rounded-full ${i <= record.intensity ? `bg-${primaryColor}-500` : (isDark ? 'bg-slate-800' : 'bg-slate-200')}`}></div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteRecord(record.id)} className={`${textMutedClass} hover:text-rose-500 p-2 transition-colors`}><Icons.Log /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className={`${glassClass} p-8 rounded-3xl space-y-8`}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2"><Icons.Settings /> 飞行系统设置</h2>
              <div className={`p-1 flex gap-1 rounded-xl ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                <button onClick={() => setThemeMode('light')} className={`p-2 rounded-lg transition-all ${themeMode === 'light' ? 'bg-white shadow-sm text-amber-500' : 'text-slate-500'}`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg></button>
                <button onClick={() => setThemeMode('dark')} className={`p-2 rounded-lg transition-all ${themeMode === 'dark' ? 'bg-slate-800 shadow-sm text-indigo-400' : 'text-slate-500'}`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg></button>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* AI Engine Settings */}
              <div className={`p-6 ${cardBgClass} rounded-2xl space-y-6 border border-${primaryColor}-500/10`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 bg-${primaryColor}-500 text-white rounded-lg`}><Icons.TrendingUp /></div>
                  <div>
                    <p className="font-bold">AI 核心引擎配置</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Core Engine Settings</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">部署模型 (Model)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setAiSettings({...aiSettings, model: 'gemini-3-flash-preview'})}
                        className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${aiSettings.model === 'gemini-3-flash-preview' ? `border-${primaryColor}-500 bg-${primaryColor}-500/10 text-${primaryColor}-600` : `${borderMutedClass} ${textMutedClass}`} flex flex-col items-center`}
                      >
                        <span>Flash 1.5</span>
                        <span className="text-[10px] opacity-60">响应迅速 / 均衡</span>
                      </button>
                      <button 
                        onClick={() => setAiSettings({...aiSettings, model: 'gemini-3-pro-preview'})}
                        className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${aiSettings.model === 'gemini-3-pro-preview' ? `border-${primaryColor}-500 bg-${primaryColor}-500/10 text-${primaryColor}-600` : `${borderMutedClass} ${textMutedClass}`} flex flex-col items-center`}
                      >
                        <span>Pro 1.5</span>
                        <span className="text-[10px] opacity-60">深度思考 / 强力</span>
                      </button>
                    </div>
                  </div>

                  {aiSettings.model.includes('pro') && (
                    <div className="animate-in slide-in-from-top-2">
                      <label className="block text-sm font-bold mb-2">深度思考预算 (Thinking Budget)</label>
                      <input 
                        type="range" min="0" max="32768" step="1024"
                        value={aiSettings.thinkingBudget} 
                        onChange={(e) => setAiSettings({...aiSettings, thinkingBudget: parseInt(e.target.value)})}
                        className={`w-full accent-${primaryColor}-600 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded-lg h-2 mb-2`}
                      />
                      <div className="flex justify-between mono text-[10px] text-slate-500">
                        <span>关闭思考</span>
                        <span className={`font-bold text-${primaryColor}-600`}>{aiSettings.thinkingBudget} TOKENS</span>
                        <span>最大逻辑</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold mb-2">自定义系统指令 (Instruction)</label>
                    <textarea 
                      placeholder="例如：您是一位严厉的空军教官，请用命令语气分析我的飞行记录..."
                      value={aiSettings.customInstruction}
                      onChange={(e) => setAiSettings({...aiSettings, customInstruction: e.target.value})}
                      className={`w-full p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'} border-none focus:ring-2 focus:ring-${primaryColor}-500 text-sm h-24 resize-none`}
                    />
                  </div>
                </div>
              </div>

              <div className={`p-6 ${cardBgClass} rounded-2xl space-y-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icons.Palette />
                  <p className="font-bold">仪表盘主题</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {THEMES.map((theme) => (
                    <button key={theme.id} onClick={() => setCurrentTheme(theme.id)} className={`p-3 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${currentTheme === theme.id ? `border-${theme.primary}-500 bg-${theme.primary}-500/10` : (isDark ? 'border-slate-800' : 'border-slate-200')}`}>
                      <div className={`w-8 h-8 rounded-full ${theme.bg} shadow-lg`}></div>
                      <span className={`text-[10px] font-bold ${currentTheme === theme.id ? `text-${theme.primary}-500` : textMutedClass}`}>{theme.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-6 ${cardBgClass} rounded-2xl space-y-4`}>
                <p className="font-bold">数据同步与导出</p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={exportToCSV} className={`bg-${primaryColor}-600/10 text-${primaryColor}-600 hover:bg-${primaryColor}-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-${primaryColor}-600/30`}>导出 CSV 报表</button>
                  <button onClick={exportBackup} className={`${isDark ? 'bg-slate-800' : 'bg-slate-200'} ${isDark ? 'text-slate-300' : 'text-slate-700'} hover:opacity-80 px-4 py-2 rounded-xl text-sm font-bold`}>系统备份 (JSON)</button>
                  <button onClick={handleImportClick} className={`${isDark ? 'bg-slate-800' : 'bg-slate-200'} ${isDark ? 'text-slate-300' : 'text-slate-700'} hover:opacity-80 px-4 py-2 rounded-xl text-sm font-bold`}>恢复数据</button>
                </div>
              </div>

              <div className={`flex justify-between items-center p-6 ${cardBgClass} rounded-2xl border border-rose-500/10`}>
                <div><p className="font-bold text-rose-500">清除所有系统数据</p><p className={`text-sm ${textMutedClass}`}>这将永久销毁本地存储的所有飞行日志。</p></div>
                {showClearConfirm ? (
                  <div className="flex gap-2">
                    <button onClick={handleSystemReset} className="bg-rose-600 text-white px-4 py-2 rounded-xl font-bold text-sm">确认</button>
                    <button onClick={() => setShowClearConfirm(false)} className={`${isDark ? 'bg-slate-800' : 'bg-slate-200'} px-4 py-2 rounded-xl font-bold text-sm`}>取消</button>
                  </div>
                ) : (
                  <button onClick={() => setShowClearConfirm(true)} className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-xl font-bold text-sm">重置系统</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`${glassClass} max-w-lg w-full rounded-3xl p-8 relative animate-in zoom-in-95 slide-in-from-bottom-10`}>
            <button onClick={() => setIsLogModalOpen(false)} className={`absolute top-6 right-6 ${textMutedClass} hover:text-${primaryColor}-500`}><Icons.Plane /></button>
            <div className="flex items-center gap-3 mb-8">
              <div className={`p-3 bg-${primaryColor}-600 rounded-2xl text-white shadow-xl shadow-${primaryColor}-900/40`}><Icons.Plane /></div>
              <div><h2 className="text-xl font-bold">记录本次飞行</h2><p className={`${textMutedClass} text-sm`}>机长，准许起飞。</p></div>
            </div>
            <form onSubmit={handleAddFlight} className="space-y-6">
              <div>
                <label className={`block text-sm font-bold ${textMutedClass} mb-2`}>航程时长 (分钟)</label>
                <input type="range" min="1" max="60" value={newFlight.duration} onChange={(e) => setNewFlight({...newFlight, duration: parseInt(e.target.value)})} className={`w-full accent-${primaryColor}-600 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded-lg h-2`} />
                <div className={`flex justify-between mt-2 mono text-xs text-${primaryColor}-600`}><span>1m</span><span className="text-lg font-bold">{newFlight.duration} MIN</span><span>60m</span></div>
              </div>
              <div>
                <label className={`block text-sm font-bold ${textMutedClass} mb-2`}>天气状况</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Clear Skies', 'Cloudy', 'Turbulence', 'Stormy', 'Night Flight'] as FlightMood[]).map((mood) => (
                    <button key={mood} type="button" onClick={() => setNewFlight({...newFlight, mood})} className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${newFlight.mood === mood ? `border-${primaryColor}-500 bg-${primaryColor}-500/10 text-${primaryColor}-600` : `${borderMutedClass} ${textMutedClass} hover:border-${primaryColor}-300`}`}>{MOOD_DISPLAY[mood]}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`block text-sm font-bold ${textMutedClass} mb-2`}>引擎推力 (强度)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button key={val} type="button" onClick={() => setNewFlight({...newFlight, intensity: val})} className={`flex-1 h-12 rounded-xl font-bold transition-all flex items-center justify-center ${newFlight.intensity >= val ? `bg-${primaryColor}-600 text-white shadow-lg` : (isDark ? 'bg-slate-800' : 'bg-slate-200') + ' ' + textMutedClass}`}>{val}</button>
                  ))}
                </div>
              </div>
              <button type="submit" className={`w-full bg-${primaryColor}-600 hover:bg-${primaryColor}-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-${primaryColor}-900/30 active:scale-95`}>完成航程记录</button>
            </form>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar for quick mobile access */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden">
          <button onClick={() => setIsLogModalOpen(true)} className={`w-16 h-16 rounded-full bg-${primaryColor}-600 text-white flex items-center justify-center shadow-2xl shadow-${primaryColor}-900 border-4 ${isDark ? 'border-slate-950' : 'border-white'} transition-all`}>
             <span className="text-3xl">+</span>
          </button>
      </div>
    </div>
  );
};

export default App;
