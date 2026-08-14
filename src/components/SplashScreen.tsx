import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('تهيئة بروتوكول الحماية');

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculated = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(calculated);

      if (calculated < 35) setStatusText('تهيئة بروتوكول الحماية');
      else if (calculated < 70) setStatusText('الاتصال بخوادم MR DOLLAR');
      else if (calculated < 95) setStatusText('تحميل بيئة السكربت المتقدمة');
      else setStatusText('جاهز للتشغيل');

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(onComplete, 150);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-ink/35 px-6 py-10 select-none">
      {/* Ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/8 blur-[140px] animate-lux-breathe" />
      <div className="pointer-events-none absolute inset-0 lux-grain opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold/25" />

      {/* Top meta line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex w-full max-w-sm items-center justify-between text-[10px] uppercase tracking-[0.32em] text-neutral-500 font-display"
      >
        <span>Vip Access</span>
        <span className="text-gold/70">Est. 2026</span>
      </motion.div>

      {/* Center emblem */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex h-36 w-36 items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-gold/20"
          />
          <div className="absolute inset-4 rounded-full border border-gold/10" />
          <div className="absolute inset-0 rounded-full bg-gold/8 blur-2xl" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-gold/40 bg-ink-2/80">
            <img src="https://cdn.phototourl.com/free/2026-08-14-ce3e077a-8edd-4201-a621-66119cb96ef0.jpg" alt="MR DOLLAR logo" className="h-20 w-20 rounded-full object-cover" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-9 text-center"
        >
          <h1 className="font-display text-3xl font-light tracking-[0.3em] text-neutral-100 sm:text-4xl">
            MR<span className="text-gold-gradient font-normal"> DOLLAR</span>
          </h1>
          <div className="mx-auto mt-5 h-px w-24 lux-hairline" />
          <p className="mt-4 text-xs font-light tracking-[0.18em] text-neutral-400">
            منظومة السكربت الذكي والربط المباشر
          </p>
        </motion.div>
      </div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-[11px] font-light tracking-wide text-neutral-400">{statusText}</span>
          <span className="font-display text-[11px] tabular-nums text-gold">{progress}%</span>
        </div>

        <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-ink-3/25">
          <motion.div
            className="h-full rounded-full bg-gold-gradient"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        <button
          onClick={onComplete}
          className="mx-auto mt-8 block text-[11px] font-light tracking-[0.2em] text-neutral-500 transition-colors hover:text-gold cursor-pointer"
        >
          تخطي
        </button>
      </motion.div>
    </div>
  );
};
