import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Wifi } from 'lucide-react';

export const GameTopBar: React.FC<{ title: string; badge?: string; accent?: 'gold' | 'azure' }> = ({
  title,
  badge,
  accent = 'gold',
}) => {
  const isGold = accent === 'gold';
  return (
    <header
      className={`sticky top-0 z-30 w-full border-b bg-black/70 backdrop-blur-xl ${
        isGold ? 'border-hair' : 'border-azure/25'
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-[520px] items-center justify-between px-4">
        <Link
          to="/"
          className={`flex h-9 w-9 items-center justify-center rounded-xl border bg-ink-2/50 text-neutral-300 transition-colors ${
            isGold ? 'border-hair hover:text-gold' : 'border-azure/25 hover:text-azure'
          }`}
        >
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="flex flex-col items-center">
          <span className="font-display text-[13px] font-black tracking-wide text-neutral-50">{title}</span>
          {badge && (
            <span
              className={`font-display text-[8px] font-bold uppercase tracking-[0.3em] ${
                isGold ? 'text-gold' : 'text-azure'
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <div className="flex h-9 items-center gap-1.5 rounded-xl border border-hair bg-ink-2/50 px-2.5">
          <Wifi className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-display text-[9px] font-bold uppercase tracking-widest text-neutral-400">Live</span>
        </div>
      </div>
    </header>
  );
};


export const GameLogo: React.FC = () => (
  <div className="flex flex-col items-center">
    <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] border border-gold/25 bg-black/30 shadow-gold-lux">
      <img src="https://cdn.phototourl.com/free/2026-08-14-ce3e077a-8edd-4201-a621-66119cb96ef0.jpg" alt="MR DOLLAR logo" className="h-full w-full rounded-[20px] object-cover" loading="lazy" />
      <span className="absolute inset-2 rounded-[14px] border border-gold/10" />
    </div>
    <h1 className="mt-3 font-display text-lg font-black tracking-tight text-neutral-50">
      MR DOLLAR <span className="text-gold">V1</span>
    </h1>
    <div className="mt-1.5 h-px w-24 lux-hairline" />
  </div>
);

export const GameButtons: React.FC<{ onStart: () => void; onReset: () => void; disabled?: boolean }> = ({
  onStart,
  onReset,
  disabled,
}) => (
  <div className="grid grid-cols-2 gap-3">
    <button
      onClick={onStart}
      disabled={disabled}
      className="h-12 cursor-pointer rounded-xl bg-white font-display text-[11px] font-black uppercase tracking-[0.22em] text-black shadow-lg shadow-white/10 transition-all hover:bg-neutral-200 active:scale-[0.98] disabled:opacity-50"
    >
      بدأ
    </button>
    <button
      onClick={onReset}
      className="h-12 cursor-pointer rounded-xl border border-white/25 bg-white/[0.06] font-display text-[11px] font-black uppercase tracking-[0.22em] text-white transition-all hover:bg-white/15 active:scale-[0.98]"
    >
      اعاده بدأ
    </button>
  </div>
);
