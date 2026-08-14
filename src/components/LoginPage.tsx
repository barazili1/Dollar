import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  KeyRound,
  Lock,
  ScanFace,
  Send,
  Ticket,
} from 'lucide-react';
import { isExpired, listCodes, saveSession } from '@/lib/codes';
import { GameChoiceDialog } from './GameChoiceDialog';

interface LoginPageProps {
  onGoToConditions: () => void;
  onSuccessfulLogin?: (code: string) => void;
}

const PROMO_CODE = 'MELBG3';
const TELEGRAM_URL = 'https://t.me/MELBET_Mr_Dollar';

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToConditions }) => {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showGames, setShowGames] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const entered = accessCode.trim().toUpperCase();
    if (!entered) {
      setErrorMessage('يرجى إدخال كود الدخول الخاص بك للمتابعة.');
      return;
    }

    setIsLoading(true);
    try {
      const codes = await listCodes();
      const match = codes.find((c) => (c.code || '').trim().toUpperCase() === entered);

      if (!match) {
        setErrorMessage(
          'كود الدخول غير مفعل حالياً أو لم يتم ربطه بحسابك. يرجى إتمام خطوات إنشاء وتفعيل الحساب أولاً للحصول على الكود.',
        );
      } else if (!match.active) {
        setErrorMessage('هذا الكود موقوف من قبل الإدارة. تواصل مع المطور.');
      } else if (isExpired(match)) {
        setErrorMessage('انتهت صلاحية هذا الكود. يرجى الحصول على كود جديد.');
      } else {
        saveSession({ code: match.code, expiresAt: match.expiresAt });
        setShowGames(true);
      }
    } catch {
      setErrorMessage('تعذر الاتصال بالسيرفر للتحقق من الكود. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPromo = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 py-8 select-none">
      {/* ambience */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold/8 blur-[150px] animate-lux-breathe" />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto w-full max-w-[380px] rounded-[28px] border border-hair bg-ink/80 p-5 backdrop-blur-xl sm:p-6"
      >
        {/* Logo + Title */}
        <div className="flex flex-col items-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] border border-gold/25 bg-black/30 shadow-gold-lux">
            <img src="https://cdn.phototourl.com/free/2026-08-14-ce3e077a-8edd-4201-a621-66119cb96ef0.jpg" alt="MR DOLLAR logo" className="h-full w-full rounded-[20px] object-cover" />
            <span className="absolute inset-2 rounded-[14px] border border-gold/10" />
          </div>

          <h1 className="mt-4 text-center font-display text-[24px] font-black leading-none tracking-tight text-neutral-50">
            MR DOLLAR <span className="text-gold">V1</span>
          </h1>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]" />
            <span className="font-display text-[9px] font-semibold uppercase tracking-[0.36em] text-neutral-400">
              System Online
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="access-code"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300"
              dir="ltr"
            >
              <KeyRound className="h-3.5 w-3.5 text-gold" strokeWidth={1.8} />
              License Key
            </label>

            <div className="group relative">
              <KeyRound
                className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-600"
                strokeWidth={1.6}
              />
              <input
                id="access-code"
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="XXXX - XXXX - XXXX - XXXX"
                dir="ltr"
                className="h-12 w-full rounded-xl border border-hair bg-ink-2/40 px-10 text-center font-display text-[12px] tracking-[0.18em] text-neutral-100 placeholder:text-neutral-700 outline-none transition-all focus:border-gold/55 focus:bg-ink-2/80"
              />
              <Lock
                className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-600"
                strokeWidth={1.6}
              />
            </div>
          </div>

              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 rounded-2xl border border-destructive/25 bg-destructive/8 p-4 text-right">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" strokeWidth={1.5} />
                        <p className="text-xs font-light leading-relaxed text-neutral-200">{errorMessage}</p>
                      </div>
                      <button
                        type="button"
                        onClick={onGoToConditions}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gold/30 py-2.5 text-[11px] font-medium tracking-wide text-gold transition-all hover:bg-gold/10 cursor-pointer"
                      >
                        <span>تفعيل الحساب واستلام الكود</span>
                        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative h-12 w-full overflow-hidden rounded-xl bg-white font-display text-[11px] font-black uppercase tracking-[0.26em] text-black shadow-lg shadow-white/10 transition-all hover:bg-neutral-200 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-black/5 blur-md animate-lux-sheen" />
            {isLoading ? (
              <span className="relative inline-flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                Verifying
              </span>
            ) : (
              <span className="relative inline-flex items-center gap-2.5">
                <ScanFace className="h-3.5 w-3.5" strokeWidth={2} />
                Authenticate
              </span>
            )}
          </button>
        </form>

        {/* Promocode ticket */}
        <div
          onClick={handleCopyPromo}
          className="group/btn mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-white/25 bg-white/[0.04] p-3 transition-all hover:border-white/60"
          dir="ltr"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 bg-black/30">
              <Ticket className="h-4 w-4 text-white" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">Promocode</span>
              <span className="font-display text-base font-black tracking-wide text-white">{PROMO_CODE}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pr-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 transition-colors group-hover/btn:text-white">
            {copied ? 'Copied' : 'Copy'}
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </div>
        </div>


        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onGoToConditions}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-hair bg-ink-2/45 text-[11px] font-bold text-neutral-200 transition-all hover:border-white/45 hover:text-white"
          >
            <KeyRound className="h-3.5 w-3.5 text-gold" strokeWidth={1.7} />
            انشاء الحساب
          </button>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-hair bg-ink-2/45 text-[11px] font-bold text-neutral-200 transition-all hover:border-white/45 hover:text-white"
          >
            <Send className="h-3.5 w-3.5 text-gold" strokeWidth={1.7} />
            تواصل مع المطور
          </a>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400">
          <span>apple</span>
          <span className="text-neutral-700">|</span>
          <span>mines</span>
        </div>

      </motion.div>

      <GameChoiceDialog isOpen={showGames} onClose={() => setShowGames(false)} />

    </div>
  );
};
