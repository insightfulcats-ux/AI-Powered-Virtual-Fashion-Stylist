
import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, ShoppingBag, Eye, Wand2, X, Download, Share2, Check } from 'lucide-react';
import { getStylingRecommendation, virtualTryOn } from '../services/geminiService';
import { OCCASIONS } from '../constants';
import { OutfitRecommendation, UserProfile, ClothingItem } from '../types';

const StylistTool: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Setup, 2: Recommendation, 3: Virtual Try-On
  const [profile, setProfile] = useState<UserProfile>({
    name: 'User',
    stylePreferences: ['Minimalist'],
    bodyType: 'Athletic'
  });
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [tryOnImage, setTryOnImage] = useState<string | null>(null);
  const [isTryingOn, setIsTryingOn] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateStyling = async () => {
    setIsGenerating(true);
    try {
      const base64 = uploadedImage?.split(',')[1];
      const result = await getStylingRecommendation(profile, occasion, base64);
      setRecommendation(result);
      // Automatically select all items initially
      setSelectedItemIds(new Set(result.items.map(i => i.id)));
      setStep(2);
    } catch (error) {
      alert("Failed to generate styling. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    const next = new Set(selectedItemIds);
    if (next.has(itemId)) next.delete(itemId);
    else next.add(itemId);
    setSelectedItemIds(next);
  };

  const handleVirtualTryOn = async () => {
    if (!uploadedImage || !recommendation) return;
    const selectedItems = recommendation.items.filter(i => selectedItemIds.has(i.id));
    if (selectedItems.length === 0) {
      alert("Please select at least one item to try on.");
      return;
    }

    setIsTryingOn(true);
    setStep(3);
    try {
      const base64 = uploadedImage.split(',')[1];
      const result = await virtualTryOn(base64, selectedItems, recommendation.explanation);
      setTryOnImage(result);
    } catch (error) {
      alert("Virtual try-on failed. Ensure your photo is clear and items are compatible.");
      setStep(2);
    } finally {
      setIsTryingOn(false);
    }
  };

  const downloadImage = () => {
    if (!tryOnImage) return;
    const link = document.createElement('a');
    link.href = tryOnImage;
    link.download = `LuminaStyle_${occasion}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareImage = async () => {
    if (!tryOnImage) return;
    try {
      // In a real mobile app, this would use Web Share API
      if (navigator.share) {
        const response = await fetch(tryOnImage);
        const blob = await response.blob();
        const file = new File([blob], 'my-style.png', { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: 'My LuminaStyle Outfit',
          text: `Check out my new ${occasion} look curated by AI!`,
        });
      } else {
        alert("Sharing is not supported on this browser. Try downloading instead.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">AI Personal Stylist</h1>
        <p className="text-gray-500">Design your perfect look with generative AI visualization.</p>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white border rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">What's the Occasion?</h3>
              <div className="grid grid-cols-1 gap-2">
                {OCCASIONS.map(occ => (
                  <button
                    key={occ}
                    onClick={() => setOccasion(occ)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      occasion === occ ? 'bg-black text-white border-black' : 'bg-white hover:border-gray-400'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white border rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Body Shape Analysis</h3>
              <select 
                className="w-full p-3 border rounded-xl bg-gray-50 text-sm focus:ring-2 ring-black"
                value={profile.bodyType}
                onChange={(e) => setProfile({...profile, bodyType: e.target.value as any})}
              >
                <option>Pear</option>
                <option>Hourglass</option>
                <option>Rectangle</option>
                <option>Inverted Triangle</option>
                <option>Athletic</option>
                <option>Apple</option>
              </select>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-[40px] p-12 shadow-sm flex flex-col items-center justify-center text-center border-dashed border-2 border-gray-200 min-h-[400px]">
              {uploadedImage ? (
                <div className="relative group animate-fadeIn">
                  <img src={uploadedImage} alt="Preview" className="max-h-96 rounded-2xl shadow-xl border-8 border-white" />
                  <button 
                    onClick={() => setUploadedImage(null)}
                    className="absolute -top-4 -right-4 bg-white border shadow-xl rounded-full p-2.5 text-red-500 hover:bg-red-50 transition-all transform hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-400">
                    <Camera className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold mb-2">Start your session</h2>
                  <p className="text-gray-500 text-sm mb-10 max-w-sm">
                    Upload a portrait or full-body shot. Our AI uses this as a base for your virtual fitting.
                  </p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-black text-white px-10 py-4 rounded-full text-sm font-bold flex items-center gap-3 hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <Upload className="w-5 h-5" />
                    Upload My Photo
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </>
              )}
            </div>

            <button
              onClick={generateStyling}
              disabled={isGenerating || !uploadedImage}
              className={`w-full py-5 rounded-full text-lg font-bold flex items-center justify-center gap-3 transition-all ${
                isGenerating 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : !uploadedImage 
                    ? 'bg-gray-50 text-gray-300' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-indigo-200 hover:-translate-y-1'
              }`}
            >
              {isGenerating ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
              {isGenerating ? 'Curating Modern Looks...' : 'Curate My Style'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && recommendation && (
        <div className="animate-slideUp">
          <div className="flex items-center gap-4 mb-10">
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-black font-semibold flex items-center gap-1 transition-colors">
              ← Restart Selection
            </button>
            <div className="h-px flex-1 bg-gray-100"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-black text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-[80px]"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full -ml-16 -mb-16 blur-[80px]"></div>
                
                <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-60 mb-3 block">Stylist Choice</span>
                <h2 className="text-4xl font-serif font-bold mb-6">{recommendation.occasion}</h2>
                <p className="text-gray-300 text-base leading-relaxed italic border-l-4 border-white/20 pl-6 mb-8">
                  "{recommendation.explanation}"
                </p>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-bold uppercase opacity-50 mr-2">Palette:</span>
                  {recommendation.colorPalette.map(color => (
                    <div 
                      key={color} 
                      className="w-12 h-12 rounded-full border-2 border-white/20 shadow-xl transform hover:scale-110 transition-transform cursor-help" 
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))}
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 flex items-start gap-4 border border-white/10">
                  <div className="bg-yellow-400 p-2.5 rounded-xl shadow-lg">
                    <RefreshCw className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <span className="font-black text-xs block mb-1 uppercase tracking-wider text-yellow-400">Trend Insights</span>
                    <p className="text-sm text-white/90 leading-normal">{recommendation.trendingTip}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-lg">Mix & Match Items</h3>
                  <p className="text-xs text-gray-400 font-medium">{selectedItemIds.size} of {recommendation.items.length} selected</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {recommendation.items.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => toggleItemSelection(item.id)}
                      className={`flex gap-4 p-5 rounded-[2rem] border-2 transition-all cursor-pointer group ${
                        selectedItemIds.has(item.id) 
                          ? 'bg-indigo-50/50 border-indigo-600 shadow-sm' 
                          : 'bg-white border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-inner">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        {selectedItemIds.has(item.id) && (
                          <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                            <Check className="text-white w-8 h-8 drop-shadow-md" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-bold text-sm ${selectedItemIds.has(item.id) ? 'text-indigo-900' : 'text-gray-900'}`}>{item.name}</h4>
                          <span className="text-sm font-bold text-gray-400">{item.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{item.brand} • {item.color}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/70">{item.type}</span>
                          <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                          <a href={item.storeUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase text-gray-900 flex items-center gap-1 hover:underline">
                            Source <ShoppingBag className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
              <div className="aspect-[3/4] bg-gray-100 rounded-[60px] overflow-hidden shadow-2xl relative group border-8 border-white">
                <img 
                  src={uploadedImage || "https://picsum.photos/seed/placeholder/800/1200"} 
                  alt="Original" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 flex items-end p-10">
                  <div>
                    <p className="text-white/60 text-xs font-bold tracking-[0.3em] uppercase mb-1">Preview Canvas</p>
                    <p className="text-white text-lg font-serif italic">Your Style Journey Starts Here</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleVirtualTryOn}
                disabled={selectedItemIds.size === 0}
                className={`w-full py-5 rounded-full text-xl font-bold flex items-center justify-center gap-4 transition-all shadow-2xl ${
                  selectedItemIds.size === 0 
                    ? 'bg-gray-100 text-gray-300 border-none' 
                    : 'bg-white border-2 border-black text-black hover:bg-black hover:text-white hover:-translate-y-1'
                }`}
              >
                <Eye className="w-6 h-6" />
                Visualize Outfit ({selectedItemIds.size})
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fadeIn text-center">
          <div className="flex items-center gap-4 mb-10">
            <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-black font-semibold flex items-center gap-1">
              ← Back to Mix & Match
            </button>
            <div className="h-px flex-1 bg-gray-100"></div>
          </div>

          <div className="max-w-3xl mx-auto space-y-10">
            <div className="aspect-[3/4] bg-white rounded-[60px] overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] relative border-8 border-white p-2">
              {isTryingOn ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-12 bg-gray-50/80 backdrop-blur-md">
                   <div className="w-20 h-20 border-[6px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                   <div className="space-y-2">
                     <p className="text-2xl font-serif italic text-gray-900">Applying your aesthetic...</p>
                     <p className="text-sm text-gray-500 max-w-xs mx-auto">AI is generating your bespoke virtual preview. This takes a moment for high fidelity.</p>
                   </div>
                </div>
              ) : (
                <div className="w-full h-full relative group">
                  <img src={tryOnImage || ""} alt="Virtual Try-On Result" className="w-full h-full object-cover rounded-[50px]" />
                  <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-2xl flex items-center gap-4 border border-white/20">
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Generated by</p>
                          <p className="text-sm font-serif font-bold">LuminaStyle Pro</p>
                        </div>
                        <div className="h-6 w-px bg-white/20"></div>
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Model</p>
                          <p className="text-sm font-serif font-bold">Gemini 2.5</p>
                        </div>
                     </div>
                  </div>
                </div>
              )}
            </div>

            {!isTryingOn && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={downloadImage}
                  className="bg-black text-white px-12 py-5 rounded-full font-bold flex items-center gap-3 shadow-xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 group"
                >
                   <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
                   Download HD Image
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={shareImage}
                    className="bg-white border-2 border-gray-200 px-8 py-5 rounded-full font-bold text-gray-700 hover:border-black hover:text-black transition-all flex items-center gap-3"
                  >
                     <Share2 className="w-5 h-5" />
                     Share Look
                  </button>
                  <button 
                    onClick={() => setStep(1)}
                    className="bg-gray-100 px-8 py-5 rounded-full font-bold text-gray-600 hover:bg-gray-200 transition-all flex items-center gap-3"
                  >
                     <RefreshCw className="w-5 h-5" />
                     Try Another
                  </button>
                </div>
              </div>
            )}

            {!isTryingOn && recommendation && (
               <div className="bg-white border rounded-[2rem] p-10 text-left shadow-sm mt-12">
                 <h3 className="text-2xl font-serif font-bold mb-6">Shopping List</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendation.items.filter(i => selectedItemIds.has(i.id)).map(item => (
                       <a 
                        key={item.id} 
                        href={item.storeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-colors group"
                       >
                         <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                           <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1">
                           <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-600">{item.name}</p>
                           <p className="text-[10px] text-gray-500">{item.brand} • {item.price}</p>
                         </div>
                         <ShoppingBag className="w-4 h-4 text-gray-300 group-hover:text-indigo-600" />
                       </a>
                    ))}
                 </div>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StylistTool;
