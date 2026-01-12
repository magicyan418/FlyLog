import React, { useState, useEffect } from 'react';
import { FlightMood, FlightRecord } from '../types';
import { Icons, MOOD_DISPLAY } from '../constants';

interface FlightLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (flight: { flightDateTime?: string; duration: number; mood: FlightMood; notes: string; process?: string; intensity: number }) => void;
  glassClass: string;
  textMutedClass: string;
  borderMutedClass: string;
  primaryColor: string;
  isDark: boolean;
  editingRecord?: FlightRecord | null;
}

export const FlightLogModal: React.FC<FlightLogModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  glassClass,
  textMutedClass,
  borderMutedClass,
  primaryColor,
  isDark,
  editingRecord
}) => {
  const [newFlight, setNewFlight] = useState<{
    flightDateTime: string;
    duration: number;
    mood: FlightMood;
    notes: string;
    process: string;
    intensity: number;
  }>({
    flightDateTime: '',
    duration: 15,
    mood: 'Clear Skies',
    notes: '',
    process: '',
    intensity: 3,
  });

  // 当编辑记录变化时，更新表单
  useEffect(() => {
    if (editingRecord) {
      // 编辑时使用记录的时间戳
      const date = new Date(editingRecord.timestamp);
      const datetime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
      setNewFlight({
        flightDateTime: datetime,
        duration: editingRecord.duration,
        mood: editingRecord.mood,
        notes: editingRecord.notes || '',
        process: editingRecord.process || '',
        intensity: editingRecord.intensity,
      });
    } else {
      // 新建时使用当前时间
      const now = new Date();
      const datetime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setNewFlight({
        flightDateTime: datetime,
        duration: 15,
        mood: 'Clear Skies',
        notes: '',
        process: '',
        intensity: 3,
      });
    }
  }, [editingRecord, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newFlight);
  };

  const handleClose = () => {
    onClose();
    // 关闭后重置表单
    const now = new Date();
    const datetime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setNewFlight({
      flightDateTime: datetime,
      duration: 15,
      mood: 'Clear Skies',
      notes: '',
      process: '',
      intensity: 3,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`${glassClass} max-w-lg w-full rounded-3xl p-8 relative animate-in zoom-in-95 slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto`}>
        <button 
          onClick={handleClose} 
          className={`absolute top-6 right-6 ${textMutedClass} hover:text-${primaryColor}-500 transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div className="flex items-center gap-3 mb-8">
          <div className={`p-3 bg-${primaryColor}-600 rounded-2xl text-white shadow-xl shadow-${primaryColor}-900/40`}>
            <Icons.Plane />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {editingRecord ? '编辑飞行记录' : '记录本次飞行'}
            </h2>
            <p className={`${textMutedClass} text-sm`}>
              {editingRecord ? '修改航班信息' : '机长，准许起飞。'}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 起飞时间 */}
          <div>
            <label className={`block text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              起飞时间 (年月日时分秒)
            </label>
            <input
              type="datetime-local"
              step="1"
              value={newFlight.flightDateTime}
              onChange={(e) => setNewFlight({...newFlight, flightDateTime: e.target.value})}
              className={`w-full p-3 rounded-xl ${
                isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900'
              } border-none focus:ring-2 focus:ring-${primaryColor}-500 text-sm mono`}
            />
          </div>

          {/* 航程时长 */}
          <div>
            <label className={`block text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              航程时长 (分钟)
            </label>
            <input 
              type="range" 
              min="1" 
              max="60" 
              value={newFlight.duration} 
              onChange={(e) => setNewFlight({...newFlight, duration: parseInt(e.target.value)})} 
              className={`w-full accent-${primaryColor}-600 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded-lg h-2`} 
            />
            <div className={`flex justify-between mt-2 mono text-xs text-${primaryColor}-600 dark:text-${primaryColor}-400`}>
              <span>1m</span>
              <span className="text-lg font-bold">{newFlight.duration} MIN</span>
              <span>60m</span>
            </div>
          </div>

          {/* 天气状况 */}
          <div>
            <label className={`block text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              天气状况
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Clear Skies', 'Cloudy', 'Turbulence', 'Stormy', 'Night Flight'] as FlightMood[]).map((mood) => (
                <button 
                  key={mood} 
                  type="button" 
                  onClick={() => setNewFlight({...newFlight, mood})} 
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    newFlight.mood === mood 
                      ? `border-${primaryColor}-500 bg-${primaryColor}-500/10 text-${primaryColor}-600 dark:text-${primaryColor}-400` 
                      : `${borderMutedClass} ${textMutedClass} hover:border-${primaryColor}-300`
                  }`}
                >
                  {MOOD_DISPLAY[mood]}
                </button>
              ))}
            </div>
          </div>

          {/* 引擎推力 */}
          <div>
            <label className={`block text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              引擎推力 (强度)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button 
                  key={val} 
                  type="button" 
                  onClick={() => setNewFlight({...newFlight, intensity: val})} 
                  className={`flex-1 h-12 rounded-xl font-bold transition-all flex items-center justify-center ${
                    newFlight.intensity >= val 
                      ? `bg-${primaryColor}-600 text-white shadow-lg` 
                      : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-600')
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* 飞行过程 */}
          <div>
            <label className={`block text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              飞行过程 (可选)
            </label>
            <textarea
              placeholder="描述本次飞行的过程、感受或使用的技巧..."
              value={newFlight.process}
              onChange={(e) => setNewFlight({...newFlight, process: e.target.value})}
              className={`w-full p-3 rounded-xl ${
                isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900'
              } border-none focus:ring-2 focus:ring-${primaryColor}-500 text-sm h-20 resize-none placeholder:text-slate-500`}
            />
          </div>

          {/* 备注 */}
          <div>
            <label className={`block text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              航班备注 (可选)
            </label>
            <input
              type="text"
              placeholder="其他需要记录的信息..."
              value={newFlight.notes}
              onChange={(e) => setNewFlight({...newFlight, notes: e.target.value})}
              className={`w-full p-3 rounded-xl ${
                isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900'
              } border-none focus:ring-2 focus:ring-${primaryColor}-500 text-sm placeholder:text-slate-500`}
            />
          </div>

          <button 
            type="submit" 
            className={`w-full bg-${primaryColor}-600 hover:bg-${primaryColor}-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-${primaryColor}-900/30 active:scale-95`}
          >
            {editingRecord ? '更新飞行记录' : '完成航程记录'}
          </button>
        </form>
      </div>
    </div>
  );
};