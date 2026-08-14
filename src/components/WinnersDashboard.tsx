import React, { useEffect, useState } from 'react';

interface Row {
  id: string;
  bet: string;
  win: string;
}

const maskId = (n: string) => `${n.slice(0, 2)}*******${n.slice(-2)}`;

const makeRow = (): Row => {
  const id = String(Math.floor(1000000000 + Math.random() * 8999999999));
  const bet = (Math.floor(Math.random() * 18) + 2) * 500;
  const mult = 1.4 + Math.random() * 7.6;
  return {
    id: maskId(id),
    bet: bet.toLocaleString('en-US'),
    win: Math.round(bet * mult).toLocaleString('en-US'),
  };
};

export const WinnersDashboard: React.FC<{ accent?: 'gold' | 'azure' }> = ({ accent = 'gold' }) => {
  const [rows, setRows] = useState<Row[]>([]);


  useEffect(() => {
    setRows(Array.from({ length: 6 }, makeRow));
    const t = setInterval(() => setRows((p) => [makeRow(), ...p.slice(0, 5)]), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-hair bg-ink/70 backdrop-blur-xl" dir="ltr">
      <div className="flex items-center justify-between border-b border-hair px-4 py-3">
        <span className="font-display text-[10px] font-black uppercase tracking-[0.26em] text-neutral-300">
          Live Winners
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="font-display text-[9px] font-bold uppercase tracking-widest text-neutral-500">Realtime</span>
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 border-b border-hair px-4 py-2 font-display text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-500">
        <span>ID</span>
        <span className="text-center">Bet Amount</span>
        <span className="text-right">Win Amount</span>
      </div>

      <div className="divide-y divide-white/5">
        {rows.map((r, i) => (
          <div key={`${r.id}-${i}`} className="grid grid-cols-3 items-center gap-2 px-4 py-2.5 text-[11px]">
            <span className="font-mono text-neutral-300">{r.id}</span>
            <span className="text-center font-mono text-neutral-400">{r.bet}</span>
            <span className={`text-right font-mono font-bold ${accent === 'gold' ? 'text-gold' : 'text-azure'}`}>
              +{r.win}
            </span>

          </div>
        ))}
      </div>
    </div>
  );
};
