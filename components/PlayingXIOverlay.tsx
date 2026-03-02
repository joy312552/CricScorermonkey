import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export const PlayingXIOverlay: React.FC = () => {
  const topRow = [
    { name: 'BABAR AAZAM', image: 'https://p16-capcut-va.ibyteimg.com/tos-alisg-i-7343482422/6890253488214310918~tplv-nhvf8v017r-jpeg.webp' }, // Babar Azam portrait
    { name: 'M RIZWAN', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rizwan&skinColor=edb98a&top=shortHair&hairColor=2c1b18' },
    { name: 'F ZAMAN', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zaman&skinColor=edb98a&top=shortHair&hairColor=2c1b18' },
    { name: 'SHADAB KHAN', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shadab&skinColor=edb98a&top=shortHair&hairColor=2c1b18' },
    { name: 'IMAD WASIM', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=imad&skinColor=edb98a&top=shortHair&hairColor=2c1b18' },
    { name: 'PRIT', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=prit&skinColor=edb98a&top=shortHair&hairColor=2c1b18' },
  ];

  const bottomRow = [
    { name: 'BUNTY', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bunty&skinColor=edb98a&top=shortHair&hairColor=2c1b18' },
    { name: 'PRASHANT', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=prashant&skinColor=edb98a&top=shortHair&hairColor=2c1b18' },
    { name: 'PRAVIN', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pravin&skinColor=edb98a&top=shortHair&hairColor=2c1b18' },
    { name: 'DHANANJAY', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dhananjay&skinColor=edb98a&top=shortHair&hairColor=2c1b18' },
    { name: 'SASA', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sasa&skinColor=edb98a&top=shortHair&hairColor=2c1b18' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent pointer-events-none font-sans"
    >
      {/* Background Container */}
      <div className="relative w-[1400px] h-[800px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10">
        
        {/* Navy Blue Sides */}
        <div className="absolute inset-y-0 left-0 w-40 bg-[#0a1a3a]" />
        <div className="absolute inset-y-0 right-0 w-40 bg-[#0a1a3a]" />

        {/* Green Geometric Framing */}
        <div className="absolute inset-0 bg-[#00b140]">
          {/* Diagonal Stripes Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 20px, transparent 20px, transparent 40px)' }} />
          
          {/* Chevron/Arrow Shapes */}
          <div className="absolute left-40 inset-y-0 w-20 bg-[#008f34] skew-x-[-15deg] -translate-x-10" />
          <div className="absolute right-40 inset-y-0 w-20 bg-[#008f34] skew-x-[15deg] translate-x-10" />
          
          {/* Stadium Light Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-b from-white/20 to-transparent blur-3xl" />
        </div>

        {/* Content Area */}
        <div className="relative h-full flex flex-col items-center pt-12">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-[120px] font-black text-white leading-none tracking-tighter drop-shadow-2xl">
              PAKISTAN
            </h1>
            <div className="w-[800px] h-1.5 bg-gradient-to-r from-transparent via-[#ffcc00] to-transparent mx-auto mt-2 shadow-[0_0_15px_#ffcc00]" />
            
            <div className="mt-6 bg-[#008f34] px-12 py-2 inline-block border border-white/20 shadow-lg">
              <span className="text-white font-black text-2xl tracking-[0.3em] uppercase">IPL 2025</span>
            </div>
          </div>

          {/* Player Grid */}
          <div className="flex flex-col gap-12 items-center">
            {/* Top Row */}
            <div className="flex gap-6">
              {topRow.map((player, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-36 h-44 bg-slate-800 border-2 border-[#006b27] overflow-hidden shadow-xl relative">
                    <img 
                      src={player.image} 
                      alt={player.name} 
                      className={`w-full h-full ${i === 0 ? 'object-cover' : 'object-contain p-2'}`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="mt-2 bg-[#ffcc00] w-full py-1.5 px-2 shadow-lg">
                    <p className="text-black font-black text-[11px] text-center whitespace-nowrap uppercase tracking-tighter">
                      {player.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="flex gap-6">
              {bottomRow.map((player, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-36 h-44 bg-slate-800 border-2 border-[#006b27] overflow-hidden shadow-xl relative">
                    <img 
                      src={player.image} 
                      alt={player.name} 
                      className="w-full h-full object-contain p-2"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="mt-2 bg-[#ffcc00] w-full py-1.5 px-2 shadow-lg">
                    <p className="text-black font-black text-[11px] text-center whitespace-nowrap uppercase tracking-tighter">
                      {player.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flame Icon */}
          <div className="absolute bottom-8 right-8">
            <div className="bg-orange-600 p-2 rounded-full shadow-[0_0_20px_rgba(234,88,12,0.6)]">
              <Flame className="w-8 h-8 text-white fill-white" />
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
