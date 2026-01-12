import React from 'react';
import { Icons } from '../constants';

interface HeaderProps {
  primaryColor: string;
  onAddFlight: () => void;
}

export const Header: React.FC<HeaderProps> = ({ primaryColor, onAddFlight }) => {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <div className={`flex items-center gap-2 text-${primaryColor}-500 mb-1 transition-colors duration-500`}>
          <Icons.Plane />
          <span className="font-bold tracking-widest text-xs uppercase mono">飞行控制中心 (TCC)</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">机长日志</h1>
      </div>
      <button 
        onClick={onAddFlight}
        className={`bg-${primaryColor}-600 hover:bg-${primaryColor}-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-${primaryColor}-900/20 flex items-center gap-2`}
      >
        <span className="text-xl leading-none">+</span> 新增飞行
      </button>
    </header>
  );
};