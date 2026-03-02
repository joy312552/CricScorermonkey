
import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export const IndiaPlayingXIOverlay: React.FC = () => {
  const topRow = [
    { name: 'J BUMRAH', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bumrah&backgroundColor=b6e3f4' },
    { name: 'R JADEJA', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jadeja&backgroundColor=b6e3f4' },
    { name: 'VIRAT KOHLI', img: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=400&h=400&auto=format&fit=crop', isReal: true },
    { name: 'ROHIT SHARMA', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit&backgroundColor=b6e3f4' },
    { name: 'S DUBE', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dube&backgroundColor=b6e3f4' },
    { name: 'TEST PLAYER', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test&backgroundColor=b6e3f4' },
  ];

  const bottomRow = [
    { name: 'NAYAN', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nayan&backgroundColor=b6e3f4' },
    { name: 'PRAVIN', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pravin&backgroundColor=b6e3f4' },
    { name: 'PRIT', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prit&backgroundColor=b6e3f4' },
    { name: 'PRASHANT', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prashant&backgroundColor=b6e3f4' },
    { name: 'BUNTY', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bunty&backgroundColor=b6e3f4' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-12 overflow-hidden pointer-events-none"
    >
      {/* Background with Stadium Blur & Lights */}
      <div className="absolute inset-0 bg-[#001a4d] overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center grayscale"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2000&auto=format&fit=crop)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#003087]/80 via-[#001a4d]/90 to-[#001a4d]" />
        
        {/* Geometric Chevron Shapes */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-full bg-[#0055b3]/20 skew-x-12 -translate-x-32 border-r-4 border-[#0055b3]/30" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-full bg-[#0055b3]/20 -skew-x-12 translate-x-32 border-l-4 border-[#0055b3]/30" />

        {/* Diagonal Stripes at edges */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-transparent via-[#0055b3]/20 to-transparent flex gap-4 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="w-4 h-full bg-black/20 -skew-x-45" />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-transparent via-[#0055b3]/20 to-transparent flex gap-4 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="w-4 h-full bg-black/20 skew-x-45" />
          ))}
        </div>

        {/* Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,85,179,0.3)_0%,transparent_70%)]" />
      </div>

      {/* Central Panel */}
      <motion.div
        initial={{ scale: 0.9, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-7xl bg-gradient-to-br from-[#003087] to-[#001a4d] border border-white/10 rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] p-12 flex flex-col items-center"
      >
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <motion.h1 
            initial={{ letterSpacing: "0.5em", opacity: 0 }}
            animate={{ letterSpacing: "0.05em", opacity: 1 }}
            className="text-[12rem] font-black text-white leading-none tracking-tight uppercase"
          >
            INDIA
          </motion.h1>
          <div className="h-2 w-full bg-[#ffcc00] shadow-[0_0_20px_#ffcc00] mt-2" />
          
          <div className="mt-6 inline-block bg-[#003087] px-12 py-2 border border-[#0055b3] rounded-sm">
            <span className="text-3xl font-black text-white uppercase tracking-[0.2em]">IPL 2025</span>
          </div>
        </div>

        {/* Player Grid */}
        <div className="w-full space-y-12">
          {/* Top Row */}
          <div className="grid grid-cols-6 gap-6">
            {topRow.map((player, idx) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-full aspect-square bg-[#001a4d] border-2 border-[#0055b3] overflow-hidden rounded-lg mb-4 group">
                  <img 
                    src={player.img} 
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover ${player.isReal ? 'scale-110' : 'scale-90'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001a4d]/60 to-transparent" />
                </div>
                <div className="w-full bg-[#ffcc00] py-2 px-1 text-center shadow-lg">
                  <span className="text-black font-black text-sm uppercase tracking-tighter whitespace-nowrap">
                    {player.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="flex justify-center gap-6">
            {bottomRow.map((player, idx) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                className="flex flex-col items-center w-[calc(16.66%-1.5rem)]"
              >
                <div className="relative w-full aspect-square bg-[#001a4d] border-2 border-[#0055b3] overflow-hidden rounded-lg mb-4">
                  <img 
                    src={player.img} 
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001a4d]/60 to-transparent" />
                </div>
                <div className="w-full bg-[#ffcc00] py-2 px-1 text-center shadow-lg">
                  <span className="text-black font-black text-sm uppercase tracking-tighter whitespace-nowrap">
                    {player.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Flame Icon */}
        <div className="absolute bottom-8 right-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)]">
            <Flame className="w-10 h-10 text-white fill-white" />
          </div>
        </div>

        {/* Side Chevrons */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-20">
          <div className="w-8 h-16 bg-white skew-x-[20deg]" />
          <div className="w-8 h-16 bg-white skew-x-[20deg]" />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-20">
          <div className="w-8 h-16 bg-white -skew-x-[20deg]" />
          <div className="w-8 h-16 bg-white -skew-x-[20deg]" />
        </div>
      </motion.div>
    </motion.div>
  );
};
