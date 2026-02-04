
import React from 'react';
import { NAVIGATION_ITEMS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:relative md:w-64 md:h-screen md:border-t-0 md:border-r">
      <div className="flex flex-row md:flex-col justify-around md:justify-start items-center md:items-stretch py-2 md:py-8 px-4 h-full">
        <div className="hidden md:flex items-center gap-2 mb-10 px-4">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-serif font-bold text-xl">L</span>
          </div>
          <span className="text-xl font-serif font-bold tracking-tight">LuminaStyle</span>
        </div>

        <nav className="flex flex-row md:flex-col gap-1 w-full">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-black text-white md:bg-gray-100 md:text-black font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="hidden md:block text-sm">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="hidden md:block mt-auto px-4 py-4">
          <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl p-4 border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-900 mb-1">PRO PLAN</p>
            <p className="text-xs text-indigo-700 mb-3">Get unlimited AI styling and 4K try-ons.</p>
            <button className="w-full bg-white py-2 rounded-lg text-xs font-bold border border-indigo-200 hover:shadow-sm transition-shadow">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
