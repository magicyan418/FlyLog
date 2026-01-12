import React from 'react';
import { FlightRecord } from '../types';
import { Icons, MOOD_COLORS, MOOD_DISPLAY } from '../constants';

interface LogsTableProps {
  records: FlightRecord[];
  onDeleteRecord: (id: string) => void;
  onEditRecord: (record: FlightRecord) => void;
  glassClass: string;
  textMutedClass: string;
  borderMutedClass: string;
  primaryColor: string;
  isDark: boolean;
}

export const LogsTable: React.FC<LogsTableProps> = ({
  records,
  onDeleteRecord,
  onEditRecord,
  glassClass,
  textMutedClass,
  borderMutedClass,
  primaryColor,
  isDark
}) => {
  return (
    <div className={`${glassClass} rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} ${textMutedClass} text-xs font-bold uppercase tracking-widest border-b ${borderMutedClass}`}>
            <th className="px-6 py-4">起飞时间</th>
            <th className="px-6 py-4">航程</th>
            <th className="px-6 py-4">天气</th>
            <th className="px-6 py-4">推力</th>
            <th className="px-6 py-4">过程</th>
            <th className="px-6 py-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${borderMutedClass}`}>
          {records.length === 0 ? (
            <tr>
              <td colSpan={5} className={`px-6 py-20 text-center ${textMutedClass}`}>
                尚无飞行历史记录。
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr
                key={record.id}
                className={`transition-colors group ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
              >
                <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  <div className="font-medium mono">
                    {new Date(record.timestamp).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`mono text-${primaryColor}-600 dark:text-${primaryColor}-400 bg-${primaryColor}-500/10 px-2 py-1 rounded text-xs font-bold`}>
                    {record.duration} 分钟
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={MOOD_COLORS[record.mood]}>
                    {MOOD_DISPLAY[record.mood]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`w-1.5 h-4 rounded-full ${
                          i <= record.intensity
                            ? `bg-${primaryColor}-500`
                            : (isDark ? 'bg-slate-800' : 'bg-slate-200')
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className={`px-6 py-4 text-xs ${textMutedClass} max-w-xs truncate`}>
                  {record.process || record.notes || '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => onEditRecord(record)}
                      className={`${textMutedClass} hover:text-${primaryColor}-500 p-2 transition-colors`}
                      title="编辑"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        <path d="m15 5 4 4"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteRecord(record.id)}
                      className={`${textMutedClass} hover:text-rose-500 p-2 transition-colors`}
                      title="删除"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};