import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Users, Sparkles, ArrowRight } from 'lucide-react';
import { AppState } from '../types';

interface NavbarProps {
  currentState: AppState;
  onNavigate: (state: AppState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentState, onNavigate }) => {
  const [onlineUsers, setOnlineUsers] = useState(14582);

  // Subtle natural fluctuation for live effect
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(14200, Math.min(14999, prev + delta));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/30 border-b border-yellow-500/20 shadow-lg shadow-black/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left Side: Brand Logo and Name */}
        <div className="flex items-center gap-3">
          {currentState === 'conditions' && (
            <button
              onClick={() => onNavigate('login')}
              className="p-2 rounded-xl bg-neutral-900/80 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center gap-1.5 text-xs font-semibold group ml-1"
              title="العودة لتسجيل الدخول"
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">تسجيل الدخول</span>
            </button>
          )}

          <div
            onClick={() => onNavigate('login')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Circular mini logo */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-neutral-900 to-black border-2 border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.35)] group-hover:shadow-[0_0_22px_rgba(255,215,0,0.6)] transition-all duration-300">
              <img src="https://cdn.phototourl.com/free/2026-08-14-ce3e077a-8edd-4201-a621-66119cb96ef0.jpg" alt="MR DOLLAR logo" className="h-full w-full rounded-full object-cover" />
              <div className="absolute inset-0 rounded-full border border-yellow-300/40 animate-ping opacity-20 pointer-events-none" />
            </div>

            {/* Branded Text */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-wider text-white font-['Outfit',sans-serif]">
                  MR
                </span>
                <span className="font-black text-xl tracking-wider text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.4)] font-['Outfit',sans-serif]">
                  DOLLAR
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 uppercase tracking-widest mr-1">
                  VIP v4.8
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 hidden sm:block tracking-normal font-medium">
                Premium Algorithm & Smart Engine
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Users Online Live Indicator */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-neutral-950/90 border border-yellow-500/30 shadow-[0_0_15px_rgba(255,215,0,0.12)]"
          >
            {/* Glowing animated dot */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD700] shadow-[0_0_10px_#FFD700]"></span>
            </span>

            {/* Online counter text */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wide font-['Outfit',sans-serif]">
              <span className="text-neutral-300 font-medium">Users Online:</span>
              <span className="text-[#FFD700] font-bold tracking-normal drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
                {onlineUsers.toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>

      </div>
    </header>
  );
};
