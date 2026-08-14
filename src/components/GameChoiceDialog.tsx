import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, X } from 'lucide-react';
import { GameType } from '@/types';

const GAMES: { key: GameType; label: string; img: string; to: string }[] = [
  {
    key: 'apple',
    label: 'Apple of Fortune',
    img: 'https://cdn.phototourl.com/free/2026-07-22-93d4f1d1-8e52-4927-a5b6-3c46cf2c52b7.jpg',
    to: '/apple',
  },
  {
    key: 'mines',
    label: 'GEMS MINES',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgxHEXEghwGCyCIeL9KIYPCpmfUeL8MXarHXlv0A61Vg&s=10',
    to: '/mines',
  },
];

export const GameChoiceDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-2xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-hair bg-ink/35 p-6 shadow-lux backdrop-blur-2xl"
      >
        <button
          onClick={onClose}
          className="absolute left-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-hair bg-ink-2/25 text-neutral-400 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-center font-display text-xl font-black text-white">اختر اللعبة</h3>
        <p className="mt-1.5 text-center text-[11px] text-neutral-400">تم تفعيل الكود بنجاح، اختر اللعبة للبدء</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {GAMES.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => navigate({ to: g.to })}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-hair bg-ink-2/50 transition-all hover:border-gold/60 active:scale-[0.98]"
            >
              <img src={g.img} alt={g.label} className="h-28 w-full object-cover" loading="lazy" />
              <div className="flex items-center justify-center gap-1.5 px-2 py-3">
                <span className="font-display text-[11px] font-black text-neutral-100 group-hover:text-gold">
                  {g.label}
                </span>
                <ArrowLeft className="h-3.5 w-3.5 text-gold" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
