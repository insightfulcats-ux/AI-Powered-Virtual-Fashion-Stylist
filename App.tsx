
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import StylistTool from './components/StylistTool';
import Wardrobe from './components/Wardrobe';
import { Settings, Bell, Search } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <Feed />;
      case 'stylist':
        return <StylistTool />;
      case 'wardrobe':
        return <Wardrobe />;
      case 'profile':
        return (
          <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full mb-6 border-4 border-white shadow-xl overflow-hidden">
               <img src="https://picsum.photos/seed/user1/400/400" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-serif font-bold mb-2">Alex Rivera</h1>
            <p className="text-gray-500 mb-8 max-w-md">Fashion Enthusiast & Minimalist. Your measurements and style preferences are securely saved.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
              <button className="bg-white border py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" /> Preferences
              </button>
              <button className="bg-white border py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" /> Notifications
              </button>
            </div>
          </div>
        );
      default:
        return <Feed />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fcfcfc] text-[#1a1a1a]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search styles, trends, or brands..." 
                className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 ring-black transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs cursor-pointer border border-indigo-200">
              AR
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-65px)]">
          {renderContent()}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
