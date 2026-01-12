import React, { useState } from 'react';
import { AviationTheme, ThemeMode, AISettings, AIProvider } from '../types';
import { Icons, THEMES } from '../constants';
import { testAIConnection } from '../services/aiService';

interface SettingsPanelProps {
  themeMode: ThemeMode;
  currentTheme: AviationTheme;
  aiSettings: AISettings;
  showClearConfirm: boolean;
  onThemeModeChange: (mode: ThemeMode) => void;
  onThemeChange: (theme: AviationTheme) => void;
  onAiSettingsChange: (settings: AISettings) => void;
  onExportCSV: () => void;
  onExportBackup: () => void;
  onImportClick: () => void;
  onSystemReset: () => void;
  onClearConfirmToggle: (show: boolean) => void;
  glassClass: string;
  textMutedClass: string;
  borderMutedClass: string;
  cardBgClass: string;
  primaryColor: string;
  isDark: boolean;
}

const AI_PROVIDERS: { id: AIProvider; name: string; defaultModel: string }[] = [
  { id: 'openai', name: 'OpenAI', defaultModel: 'gpt-4o-mini' },
  { id: 'anthropic', name: 'Anthropic', defaultModel: 'claude-3-5-sonnet-20241022' },
  { id: 'google', name: 'Google', defaultModel: 'gemini-2.0-flash-exp' },
  { id: 'custom', name: '自定义', defaultModel: '' }
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  themeMode,
  currentTheme,
  aiSettings,
  showClearConfirm,
  onThemeModeChange,
  onThemeChange,
  onAiSettingsChange,
  onExportCSV,
  onExportBackup,
  onImportClick,
  onSystemReset,
  onClearConfirmToggle,
  glassClass,
  textMutedClass,
  borderMutedClass,
  cardBgClass,
  primaryColor,
  isDark
}) => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleProviderChange = (provider: AIProvider) => {
    const providerConfig = AI_PROVIDERS.find(p => p.id === provider);
    onAiSettingsChange({
      ...aiSettings,
      provider,
      model: providerConfig?.defaultModel || aiSettings.model
    });
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    try {
      const result = await testAIConnection(aiSettings);
      setTestResult(result);
    } catch (error) {
      console.error(error);
      setTestResult({ success: false, message: "测试失败，请稍后重试" });
    } finally {

      setIsTestingConnection(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className={`${glassClass} p-8 rounded-3xl space-y-8`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            <Icons.Settings /> 飞行系统设置
          </h2>
          <div className={`p-1 flex gap-1 rounded-xl ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <button 
              onClick={() => onThemeModeChange('light')} 
              className={`p-2 rounded-lg transition-all ${
                themeMode === 'light' 
                  ? 'bg-white shadow-sm text-amber-500' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/><path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/><path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
              </svg>
            </button>
            <button 
              onClick={() => onThemeModeChange('dark')} 
              className={`p-2 rounded-lg transition-all ${
                themeMode === 'dark' 
                  ? 'bg-slate-800 shadow-sm text-indigo-400' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* AI Engine Settings */}
          <div className={`p-6 ${cardBgClass} rounded-2xl space-y-6 border border-${primaryColor}-500/10`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 bg-${primaryColor}-500 text-white rounded-lg`}>
                <Icons.TrendingUp />
              </div>
              <div>
                <p className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  AI 核心引擎配置
                </p>
                <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Core Engine Settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* AI Provider Selection */}
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  AI 厂商 (Provider)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AI_PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleProviderChange(provider.id)}
                      className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${
                        aiSettings.provider === provider.id
                          ? `border-${primaryColor}-500 bg-${primaryColor}-500/10 text-${primaryColor}-600 dark:text-${primaryColor}-400`
                          : `${borderMutedClass} ${textMutedClass} hover:border-${primaryColor}-300`
                      }`}
                    >
                      {provider.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={aiSettings.apiKey}
                  onChange={(e) => onAiSettingsChange({ ...aiSettings, apiKey: e.target.value })}
                  className={`w-full p-3 rounded-xl ${
                    isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900'
                  } border-none focus:ring-2 focus:ring-${primaryColor}-500 text-sm placeholder:text-slate-500`}
                />
              </div>

              {/* Custom Base URL (for custom provider or proxy) */}
              {aiSettings.provider === 'custom' && (
                <div className="animate-in slide-in-from-top-2">
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    自定义 API URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://api.example.com/v1"
                    value={aiSettings.baseURL || ''}
                    onChange={(e) => onAiSettingsChange({ ...aiSettings, baseURL: e.target.value })}
                    className={`w-full p-3 rounded-xl ${
                      isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900'
                    } border-none focus:ring-2 focus:ring-${primaryColor}-500 text-sm placeholder:text-slate-500`}
                  />
                </div>
              )}

              {/* Model Name */}
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  模型名称 (Model)
                </label>
                <input
                  type="text"
                  placeholder="gpt-4o-mini"
                  value={aiSettings.model}
                  onChange={(e) => onAiSettingsChange({ ...aiSettings, model: e.target.value })}
                  className={`w-full p-3 rounded-xl ${
                    isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900'
                  } border-none focus:ring-2 focus:ring-${primaryColor}-500 text-sm placeholder:text-slate-500`}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {aiSettings.provider === 'openai' && '例如: gpt-4o, gpt-4o-mini, gpt-3.5-turbo'}
                  {aiSettings.provider === 'anthropic' && '例如: claude-3-5-sonnet-20241022, claude-3-opus-20240229'}
                  {aiSettings.provider === 'google' && '例如: gemini-2.0-flash-exp, gemini-1.5-pro'}
                  {aiSettings.provider === 'custom' && '请输入完整的模型名称'}
                </p>
              </div>

              {/* Test Connection Button */}
              <div>
                <button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection || !aiSettings.apiKey}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                    isTestingConnection || !aiSettings.apiKey
                      ? `${isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-200 text-slate-400'} cursor-not-allowed`
                      : `bg-${primaryColor}-600/10 text-${primaryColor}-600 dark:text-${primaryColor}-400 hover:bg-${primaryColor}-600 hover:text-white border border-${primaryColor}-600/30`
                  }`}
                >
                  {isTestingConnection ? '测试连接中...' : '测试模型连接'}
                </button>
                {testResult && (
                  <div className={`mt-2 p-3 rounded-xl text-sm ${
                    testResult.success
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}>
                    {testResult.message}
                  </div>
                )}
              </div>

              {/* Custom Instruction */}
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  自定义系统指令 (System Instruction)
                </label>
                <textarea
                  placeholder="例如：您是一位严厉的空军教官，请用命令语气分析我的飞行记录..."
                  value={aiSettings.customInstruction}
                  onChange={(e) => onAiSettingsChange({ ...aiSettings, customInstruction: e.target.value })}
                  className={`w-full p-4 rounded-xl ${
                    isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900'
                  } border-none focus:ring-2 focus:ring-${primaryColor}-500 text-sm h-24 resize-none placeholder:text-slate-500`}
                />
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div className={`p-6 ${cardBgClass} rounded-2xl space-y-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Icons.Palette />
              <p className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                仪表盘主题
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange(theme.id)}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${
                    currentTheme === theme.id
                      ? `border-${theme.primary}-500 bg-${theme.primary}-500/10`
                      : (isDark ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-slate-300')
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${theme.bg} shadow-lg`}></div>
                  <span className={`text-[10px] font-bold ${
                    currentTheme === theme.id
                      ? `text-${theme.primary}-500`
                      : textMutedClass
                  }`}>
                    {theme.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Data Export */}
          <div className={`p-6 ${cardBgClass} rounded-2xl space-y-4`}>
            <p className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              数据同步与导出
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onExportCSV}
                className={`bg-${primaryColor}-600/10 text-${primaryColor}-600 dark:text-${primaryColor}-400 hover:bg-${primaryColor}-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-${primaryColor}-600/30`}
              >
                导出 CSV 报表
              </button>
              <button
                onClick={onExportBackup}
                className={`${
                  isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                } hover:opacity-80 px-4 py-2 rounded-xl text-sm font-bold transition-opacity`}
              >
                系统备份 (JSON)
              </button>
              <button
                onClick={onImportClick}
                className={`${
                  isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                } hover:opacity-80 px-4 py-2 rounded-xl text-sm font-bold transition-opacity`}
              >
                恢复数据
              </button>
            </div>
          </div>

          {/* System Reset */}
          <div className={`flex justify-between items-center p-6 ${cardBgClass} rounded-2xl border border-rose-500/10`}>
            <div>
              <p className="font-bold text-rose-500">清除所有系统数据</p>
              <p className={`text-sm ${textMutedClass}`}>
                这将永久销毁本地存储的所有飞行日志。
              </p>
            </div>
            {showClearConfirm ? (
              <div className="flex gap-2">
                <button
                  onClick={onSystemReset}
                  className="bg-rose-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors"
                >
                  确认
                </button>
                <button
                  onClick={() => onClearConfirmToggle(false)}
                  className={`${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                  } px-4 py-2 rounded-xl font-bold text-sm hover:opacity-80 transition-opacity`}
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => onClearConfirmToggle(true)}
                className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-xl font-bold text-sm transition-all"
              >
                重置系统
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
