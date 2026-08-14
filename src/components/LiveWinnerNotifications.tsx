import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { WinnerNotification } from '../types';

const SAMPLE_WINNERS: WinnerNotification[] = [
  { id: '1', maskedUser: '28*******18', amount: '1,000', currency: 'دينار', game: 'Apple of Fortune', timestamp: 'منذ لحظات' },
  { id: '2', maskedUser: '94*******63', amount: '2,500', currency: 'دينار', game: 'Gams Mines', timestamp: 'الآن' },
  { id: '3', maskedUser: '15*******90', amount: '750', currency: 'دينار', game: 'Apple of Fortune', timestamp: 'منذ ثوانٍ' },
  { id: '4', maskedUser: '77*******41', amount: '3,800', currency: 'دينار', game: 'Gams Mines', timestamp: 'الآن' },
  { id: '5', maskedUser: '52*******12', amount: '1,500', currency: 'دينار', game: 'Apple of Fortune', timestamp: 'منذ دقيقة' },
  { id: '6', maskedUser: '83*******99', amount: '5,000', currency: 'دينار', game: 'VIP Script', timestamp: 'الآن' },
  { id: '7', maskedUser: '31*******54', amount: '850', currency: 'دينار', game: 'Apple of Fortune', timestamp: 'منذ لحظات' },
  { id: '8', maskedUser: '66*******08', amount: '2,200', currency: 'دينار', game: 'Gams Mines', timestamp: 'الآن' },
  { id: '9', maskedUser: '49*******73', amount: '1,200', currency: 'دينار', game: 'Apple of Fortune', timestamp: 'منذ لحظات' },
  { id: '10', maskedUser: '18*******95', amount: '4,100', currency: 'دينار', game: 'Gams Mines', timestamp: 'الآن' },
];

export const LiveWinnerNotifications: React.FC = () => {
  const [currentWinner, setCurrentWinner] = useState<WinnerNotification | null>(SAMPLE_WINNERS[0] ?? null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [winnerIndex, setWinnerIndex] = useState<number>(0);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    let nextTimer: ReturnType<typeof setTimeout>;

    if (isVisible) {
      hideTimer = setTimeout(() => setIsVisible(false), 2200);
    } else {
      nextTimer = setTimeout(() => {
        setWinnerIndex((prev) => {
          const nextIdx = (prev + 1) % SAMPLE_WINNERS.length;
          setCurrentWinner(SAMPLE_WINNERS[nextIdx] ?? null);
          return nextIdx;
        });
        setIsVisible(true);
      }, 2600);
    }

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [isVisible]);

  return (
    <div className="pointer-events-none fixed left-4 top-20 z-50 sm:left-6 sm:top-24">
      <AnimatePresence mode="wait">
        {isVisible && currentWinner && (
          <motion.div
            key={currentWinner.id + winnerIndex}
            initial={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center gap-2 overflow-hidden rounded-xl border border-gold/70 bg-white/5 px-2 backdrop-blur-md"
            style={{ direction: 'ltr', width: 200, height: 45 }}
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border border-gold/40 text-gold">
              <TrendingUp className="h-3 w-3" strokeWidth={2} />
            </span>

            <div className="flex min-w-0 flex-col leading-none">
              <span className="truncate font-display text-[12px] font-bold text-neutral-50">
                {currentWinner.amount}
                <span className="ml-1 text-[9px] font-light text-gold">{currentWinner.currency}</span>
              </span>
              <span className="mt-1 truncate font-display text-[8px] tracking-[0.1em] text-neutral-400">
                ID {currentWinner.maskedUser}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
