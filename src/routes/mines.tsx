import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gem } from 'lucide-react';
import { GameButtons, GameLogo, GameTopBar } from '@/components/GameTopBar';
import { WinnersDashboard } from '@/components/WinnersDashboard';
import { GameCountdown } from '@/components/GameCountdown';
import { ParticlesBackground } from '@/components/ParticlesBackground';


const TOTAL = 25;

function MinesGame() {
  const [count, setCount] = useState(3);
  const [gems, setGems] = useState<number[]>([]);

  const start = () => {
    const pool = Array.from({ length: TOTAL }, (_, i) => i);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pool[i]!;
      pool[i] = pool[j]!;
      pool[j] = tmp;
    }
    setGems(pool.slice(0, count));
  };
  const reset = () => setGems([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-azure/25 via-black to-black text-white lux-grain">
      <ParticlesBackground accent="azure" />
      <GameTopBar title="GEMS MINES" badge="Predictor" accent="azure" />

      <main className="mx-auto w-full max-w-[520px] px-4 pb-12 pt-6">
        <GameLogo />

        <div className="mt-5">
          <GameCountdown accent="azure" />
        </div>



        {/* 5x5 grid */}
        <div className="mt-7 rounded-2xl border border-hair bg-ink/60 p-3.5 backdrop-blur-xl">
          <div className="grid grid-cols-5 gap-2" dir="ltr">
            {Array.from({ length: TOTAL }).map((_, i) => {
              const isGem = gems.includes(i);
              return (
                <motion.div
                  key={i}
                  animate={isGem ? { scale: [0.85, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 0.4, delay: isGem ? gems.indexOf(i) * 0.06 : 0 }}
                  className={`relative flex aspect-square items-center justify-center rounded-xl border transition-colors duration-300 ${
                    isGem
                      ? 'border-azure bg-azure/15 shadow-azure-lux'
                      : 'border-hair bg-gradient-to-br from-ink-3/70 to-ink-2/40'
                  }`}
                >
                  {isGem ? (
                    <Gem className="h-5 w-5 text-azure" strokeWidth={1.8} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Diamonds slider */}
        <div className="mt-5 rounded-2xl border border-hair bg-ink/70 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-[10px] font-black uppercase tracking-[0.24em] text-neutral-400">
              عدد الالماس
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-azure/30 bg-azure/10 px-2.5 py-1 font-display text-xs font-black text-azure">
              <Gem className="h-3.5 w-3.5" />
              {count}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={24}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mines-range w-full cursor-pointer"
            dir="ltr"
          />
          <div className="mt-1.5 flex justify-between font-mono text-[9px] text-neutral-600" dir="ltr">
            <span>1</span>
            <span>24</span>
          </div>

        </div>

        <div className="mt-5">
          <GameButtons onStart={start} onReset={reset} />
        </div>

        <div className="mt-6">
          <WinnersDashboard accent="azure" />
        </div>

      </main>
    </div>
  );
}

export const Route = createFileRoute('/mines')({
  head: () => ({
    meta: [
      { title: 'Gems Mines Predictor | MR DOLLAR' },
      { name: 'description', content: 'توقعات لعبة الألغام مع شبكة 5×5 وتحديد عدد الألماس من سكربت MR DOLLAR.' },
      { property: 'og:title', content: 'Gems Mines Predictor | MR DOLLAR' },
      { property: 'og:description', content: 'شبكة 5×5 وتحديد عدد الألماس بواجهة أنيقة.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: MinesGame,
});
