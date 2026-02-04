
import React from 'react';
import { PlusCircle, Search, Filter, Grid, List } from 'lucide-react';

const Wardrobe: React.FC = () => {
  const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-1">Your Digital Wardrobe</h1>
          <p className="text-gray-500 text-sm">Organize and remix your collection.</p>
        </div>
        <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 w-fit">
          <PlusCircle className="w-4 h-4" /> Add New Item
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              cat === 'All' ? 'bg-black text-white shadow-md' : 'bg-white border text-gray-600 hover:border-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
        <div className="flex-1"></div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button className="p-1.5 bg-white shadow-sm rounded-md"><Grid className="w-4 h-4" /></button>
          <button className="p-1.5 text-gray-400"><List className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-[4/5] bg-gray-50 rounded-2xl mb-3 overflow-hidden border border-transparent group-hover:border-black transition-all relative">
              <img 
                src={`https://picsum.photos/seed/wardrobe${i}/400/500`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                alt="Clothing item"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-red-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
              </div>
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wide">Brand Name</h4>
            <p className="text-xs text-gray-500">Classic Item Name</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
