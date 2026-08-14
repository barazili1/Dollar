import React, { useEffect, useState } from 'react';
import { Clock, Infinity as InfinityIcon } from 'lucide-react';
import { formatRemaining, readSession } from '@/lib/codes';

export const GameCountdown: React.FC<{ accent?: 'gold' | 'azure' }> = ({ accent = 'gold' }) => {
  const [expiresAt, setExpiresAt] = useState<number | null | undefined>(undefined);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const s = readSession();
    setExpiresAt(s ? s.expiresAt : undefined);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (expiresAt === undefined) return null;

  const isGold = accent === 'gold';
  const border = isGold ? 'border-gold/30 bg-gold/[0.07]' : 'border-azure/30 bg-azure/[0.07]';
  const text = isGold ? 'text-gold' : 'text-azure';
  const lifetime = expiresAt === null;
  const remaining = lifetime ? 0 : Math.max(0, expiresAt - now);
  const ended = !lifetime && remaining <= 0;

  return (
    <div
      className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
        ended ? 'border-destructive/40 bg-destructive/10' : border
      }`}
    >
      <span className="font-display text-[10px] font-black uppercase tracking-[0.24em] text-neutral-400">
        الوقت المتبقي
      </span>
      <span
        className={`flex items-center gap-2 font-mono text-lg font-black tabular-nums ${
          ended ? 'text-destructive' : text
        } ${!ended && !lifetime ? 'animate-pulse' : ''}`}
        dir="ltr"
      >
        {lifetime ? (
          <>
            <InfinityIcon className="h-4 w-4" />
            LIFETIME
          </>
        ) : (
          <>
            <Clock className="h-4 w-4" />
            {ended ? 'EXPIRED' : formatRemaining(remaining)}
          </>
        )}
      </span>
    </div>
  );
};
