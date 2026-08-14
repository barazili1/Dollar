import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Apple, TrendingUp } from 'lucide-react';
import { GameButtons, GameLogo, GameTopBar } from '@/components/GameTopBar';
import { WinnersDashboard } from '@/components/WinnersDashboard';
import { GameCountdown } from '@/components/GameCountdown';
import { ParticlesBackground } from '@/components/ParticlesBackground';


const CELLS = 5;
const ODDS = [1.23, 1.54, 1.93, 2.41, 4.02, 6.71, 11.18, 27.97, 69.93, 349.68];

function AppleGame() {
  const [oddIndex, setOddIndex] = useState(0);
  const [safeCell, setSafeCell] = useState<number | null>(null);

  const start = () => {
    setSafeCell(Math.floor(Math.random() * CELLS));
    setOddIndex((i) => (i + 1) % ODDS.length);
  };
  const reset = () => {
    setSafeCell(null);
    setOddIndex(0);
  };


  return (
    <div className="min-h-screen bg-black text-white lux-grain">
      <ParticlesBackground accent="gold" />
      <GameTopBar title="APPLE OF FORTUNE" badge="Predictor" />

      <main className="mx-auto w-full max-w-[520px] px-4 pb-12 pt-6">
        <GameLogo />

        <div className="mt-5">
          <GameCountdown />
        </div>



        {/* Odds strip (carousel) */}
        <div className="mt-7 rounded-2xl border border-hair bg-ink/70 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 font-display text-[10px] font-black uppercase tracking-[0.24em] text-neutral-400">
              <TrendingUp className="h-3.5 w-3.5 text-gold" />
              Odds
            </span>
            <span className="font-display text-xl font-black text-gold">{(ODDS[oddIndex] ?? 1).toFixed(2)}x</span>
          </div>

          <div className="relative h-14 overflow-hidden" dir="ltr">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent" />
            <motion.div
              className="absolute top-1/2 left-1/2 flex items-center gap-2"
              style={{ marginLeft: -44 }}
              animate={{ x: -oddIndex * 96, y: '-50%' }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            >
              {ODDS.map((o, i) => {
                const active = i === oddIndex;
                return (
                  <button
                    key={o}
                    onClick={() => setOddIndex(i)}
                    style={{ width: 88 }}
                    className={`h-11 shrink-0 cursor-pointer rounded-xl border font-display text-xs font-black transition-all duration-300 ${
                      active
                        ? 'scale-105 border-gold bg-gold/15 text-gold shadow-gold-lux'
                        : 'border-hair bg-ink-2/40 text-neutral-500 blur-[1.5px] opacity-60'
                    }`}
                  >
                    {o.toFixed(2)}x
                  </button>
                );
              })}
            </motion.div>
          </div>
        </div>


        {/* Single row grid */}
        <div className="mt-5 rounded-2xl border border-hair bg-ink/60 p-4 backdrop-blur-xl">
          <div className="grid grid-cols-5 gap-2.5" dir="ltr">
            {Array.from({ length: CELLS }).map((_, i) => {
              const revealed = safeCell !== null;
              const isSafe = safeCell === i;
              return (
                <motion.div
                  key={i}
                  animate={revealed && isSafe ? { scale: [0.9, 1.06, 1] } : { scale: 1 }}
                  transition={{ duration: 0.45 }}
                  className={`relative flex aspect-square items-center justify-center rounded-xl border transition-all duration-300 ${
                    revealed && isSafe
                      ? 'border-gold bg-gold/15 shadow-gold-lux'
                      : 'border-hair bg-ink-2/50'
                  }`}
                >
                  {revealed && isSafe ? (
                    <Apple className="h-6 w-6 text-gold" strokeWidth={1.8} />
                  ) : (
                    <span className="font-display text-[11px] font-black text-neutral-700">{i + 1}</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <GameButtons onStart={start} onReset={reset} />
        </div>

        <div className="mt-6">
          <WinnersDashboard />
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute('/apple')({
  head: () => ({
    meta: [
      { title: 'Apple of Fortune Predictor | MR DOLLAR' },
      { name: 'description', content: 'توقعات تفاحة الحظ بأودد دقيقة وواجهة أنيقة من سكربت MR DOLLAR.' },
      { property: 'og:title', content: 'Apple of Fortune Predictor | MR DOLLAR' },
      { property: 'og:description', content: 'توقعات تفاحة الحظ بأودد دقيقة وواجهة أنيقة.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: AppleGame,
});
