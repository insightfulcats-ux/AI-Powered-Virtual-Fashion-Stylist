
import React, { useEffect, useState } from 'react';
import { fetchTrends } from '../services/geminiService';
import { Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

const Feed: React.FC = () => {
  const [trends, setTrends] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const data = await fetchTrends();
        setTrends(data.text);
      } catch (error) {
        console.error("Trends error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTrends();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">Morning, Style Icon</h1>
          <p className="text-gray-500">Curated trends and inspiration just for you.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm font-semibold bg-white border px-4 py-2 rounded-full shadow-sm">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span>New Trends for 2025</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="relative group overflow-hidden rounded-3xl h-80 shadow-lg cursor-pointer">
          <img 
            src="https://picsum.photos/seed/fashion1/800/800" 
            alt="Trend 1" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium w-fit mb-3">COLLECTION</span>
            <h3 className="text-2xl text-white font-serif font-bold mb-1">Sustainable Velvet</h3>
            <p className="text-gray-200 text-sm">How luxury is meeting ecological responsibility in the coming year.</p>
          </div>
        </div>
        <div className="relative group overflow-hidden rounded-3xl h-80 shadow-lg cursor-pointer">
          <img 
            src="https://picsum.photos/seed/fashion2/800/800" 
            alt="Trend 2" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium w-fit mb-3">TRENDING</span>
            <h3 className="text-2xl text-white font-serif font-bold mb-1">Digital Nomad Chic</h3>
            <p className="text-gray-200 text-sm">Combining comfort with sharp silhouettes for the mobile professional.</p>
          </div>
        </div>
      </div>

      <section className="bg-white border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-indigo-600">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-lg font-bold">2025 Style Briefing</h2>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
            {trends}
          </div>
        )}

        <button className="mt-8 flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all">
          Explore Trend Reports <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};

export default Feed;
