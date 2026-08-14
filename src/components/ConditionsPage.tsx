import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Copy,
  CreditCard,
  Crown,
  Download,
  Send,
  ShieldCheck,
  Smartphone,
  Upload,
  User,
  X,
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { GameType } from '../types';
import { VerificationDialog } from './VerificationDialog';

interface ConditionsPageProps {
  onBackToLogin: () => void;
}

const PLATFORM_NAME = 'MELBET';
const PROMO_CODE = 'MELBG3';
const DOWNLOAD_URL = 'https://refpa3665.com/L?tag=d_5703114m_70867c_&site=5703114&ad=70867';
const REGISTER_URL = 'https://refpa3665.com/L?tag=d_5703114m_2170c_&site=5703114&ad=2170';
const TELEGRAM_URL = 'https://t.me/+loPsLXn4uFNkMjM0';
const ADMIN_ID = '000111000';

export const ConditionsPage: React.FC<ConditionsPageProps> = ({ onBackToLogin }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const [userId, setUserId] = useState('');
  const [telegramUser, setTelegramUser] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  const [depositImg, setDepositImg] = useState<string | null>(null);
  const [depositImgName, setDepositImgName] = useState<string | null>(null);
  const [depositFile, setDepositFile] = useState<File | null>(null);
  const [idImg, setIdImg] = useState<string | null>(null);
  const [idImgName, setIdImgName] = useState<string | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);

  const depositInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{ userId?: boolean; telegram?: boolean; game?: boolean }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [checkingTg, setCheckingTg] = useState(false);
  const [tgError, setTgError] = useState<string | null>(null);

  const hasError = errors.userId || errors.telegram || errors.game;

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const readImage = (file: File, onDone: (data: string, name: string, file: File) => void) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = e.target?.result as string;
      onDone(raw, file.name, file);
    };
    reader.readAsDataURL(file);
  };


  const validateAndSubmit = async () => {
    const trimmedId = userId.trim();

    // Admin shortcut: this ID unlocks the admin panel directly
    if (trimmedId === ADMIN_ID) {
      setErrors({});
      void navigate({ to: '/admin' });
      return;
    }

    const newErrors = {
      userId: !trimmedId,
      telegram: !telegramUser.trim() || telegramUser.trim() === '@',
      game: !selectedGame,
    };
    setErrors(newErrors);

    if (newErrors.userId || newErrors.telegram || newErrors.game) return;

    setTgError(null);
    setCheckingTg(true);
    try {
      const res = await fetch('/api/public/check-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: telegramUser.trim() }),
      });
      const data = await res.json();
      if (!data.exists) {
        setErrors((p) => ({ ...p, telegram: true }));
        setTgError(
          data.reason === 'format'
            ? 'يوزر التيليجرام غير صحيح (5-32 حرف/رقم أو _ )'
            : 'هذا اليوزر غير موجود على تيليجرام، تأكد من كتابته صح'
        );
        return;
      }
    } catch {
      // ignore network failure and continue
    } finally {
      setCheckingTg(false);
    }

    setIsDialogOpen(true);
  };


  const games: { key: GameType; label: string; img: string }[] = [
    {
      key: 'apple',
      label: 'Apple of fortune',
      img: 'https://cdn.phototourl.com/free/2026-07-22-93d4f1d1-8e52-4927-a5b6-3c46cf2c52b7.jpg',
    },
    {
      key: 'mines',
      label: 'GEMS MINES',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgxHEXEghwGCyCIeL9KIYPCpmfUeL8MXarHXlv0A61Vg&s=10',
    },
  ];

  return (
    <div className="relative flex h-full flex-col overflow-y-auto px-5 pb-24 pt-6">
      {/* Back */}
      <button
        onClick={onBackToLogin}
        className="mb-6 inline-flex items-center gap-2 self-start text-[11px] font-bold text-zinc-500 transition-colors hover:text-gold cursor-pointer"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        <span>العودة لصفحة الدخول</span>
      </button>

      {/* Premium Header */}
      <div className="relative z-10 mb-10 text-center">
        <div className="mb-5 inline-flex items-center justify-center rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 to-zinc-900 p-4 shadow-[0_0_25px_rgba(255,191,0,0.1)]">
          <Crown className="h-8 w-8 text-gold drop-shadow-[0_0_8px_rgba(255,191,0,0.5)]" />
        </div>
        <h2 className="mb-2 font-display text-3xl font-black tracking-tighter text-white">التفعيل مطلوب</h2>
        <p className="mx-auto max-w-[260px] text-sm font-medium leading-relaxed text-zinc-500">
          أكمل الخطوات التالية لتفعيل حسابك والحصول على كود الدخول
        </p>
      </div>

      {/* Vertical Process Timeline */}
      <div className="relative">
        <div className="absolute bottom-12 left-[15px] top-5 w-[2px] bg-gradient-to-b from-gold via-zinc-800 to-zinc-900/0" />

        {/* Step 1: Install */}
        <div className="group relative mb-10 pl-12">
          <div className="absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/30 shadow-lg transition-colors group-hover:border-gold">
            <Smartphone className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-gold" />
          </div>

          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-sm transition-colors hover:bg-zinc-900/30">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black/30 p-1.5 shadow-inner">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgb3Sh3zdS1zdde4dibdKtH51GMaRsPn8gn8_o7UxnUw&s=10" alt="MELBET logo" className="h-full w-full rounded-lg object-contain" loading="lazy" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">تحميل التطبيق</h3>
                  <span className="font-mono text-[10px] font-medium text-gold-soft">{PLATFORM_NAME} BET</span>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wide text-gold">
                Official
              </span>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-zinc-500">
              قم بتحميل التطبيق الرسمي لمنصة {PLATFORM_NAME} لأجهزة أندرويد أو آيفون
            </p>

            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white font-display text-xs font-bold tracking-wide text-black shadow-lg shadow-white/5 transition-all hover:bg-zinc-200 active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              <span>تحميل التطبيق</span>
            </a>
          </div>
        </div>

        {/* Telegram Subscription Step */}
        <div className="group relative mb-10 pl-12">
          <div className="absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/30 shadow-lg transition-colors group-hover:border-gold">
            <Send className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-gold" />
          </div>

          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-sm transition-colors hover:bg-zinc-900/30">
            <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black/30 p-1.5"><img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Telegram_2019_Logo.svg" alt="Telegram logo" className="h-full w-full object-contain" loading="lazy" /></div>
            <h3 className="mb-1 flex items-center gap-2 font-display text-base font-bold text-white">
              الاشتراك في القناة
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-display text-[10px] uppercase tracking-wide text-blue-400">
                Telegram
              </span>
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-zinc-500">
              اشترك في قناة التيليجرام لمتابعة التحديثات واستلام كود التفعيل
            </p>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white font-display text-xs font-bold tracking-wide text-black shadow-lg shadow-white/10 transition-all hover:bg-neutral-200 active:scale-[0.98]"
            >
              <Send className="h-4 w-4" />
              <span>الاشتراك الآن</span>
            </a>
          </div>
        </div>

        {/* Step 2: Promo Code */}
        <div className="group relative mb-10 pl-12">
          <div className="absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/30 shadow-lg transition-colors group-hover:border-gold">
            <User className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-gold" />
          </div>

          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-sm transition-colors hover:bg-zinc-900/30">
            <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black/30 p-1.5"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgb3Sh3zdS1zdde4dibdKtH51GMaRsPn8gn8_o7UxnUw&s=10" alt="MELBET logo" className="h-full w-full object-contain" loading="lazy" /></div>
            <h3 className="mb-1 font-display text-base font-bold text-white">التسجيل بالبروموكود</h3>
            <p className="mb-4 text-xs leading-relaxed text-zinc-500">
              انسخ البروموكود واستخدمه أثناء التسجيل لربط حسابك بالسكربت
            </p>

            {/* Promo Ticket */}
            <div
              onClick={handleCopy}
              className="group/btn relative cursor-pointer overflow-hidden rounded-xl border border-dashed border-zinc-600 bg-black/40 p-1 transition-all hover:border-gold"
            >
              <div className="absolute inset-0 bg-gold/5 opacity-0 transition-opacity group-hover/btn:opacity-100" />
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Promo Code</span>
                  <span className="font-mono text-lg font-black tracking-widest text-white transition-colors group-hover/btn:text-gold-soft">
                    {PROMO_CODE}
                  </span>
                </div>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                    copied
                      ? 'bg-gold text-black'
                      : 'bg-zinc-800/30 text-zinc-400 group-hover/btn:bg-zinc-700 group-hover/btn:text-white'
                  }`}
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-4 w-4" />}
                </div>
              </div>
            </div>

            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white text-xs font-bold tracking-wide text-black shadow-lg shadow-white/5 transition-all hover:bg-zinc-200 active:scale-[0.98]"
            >
              <User className="h-4 w-4 text-black" />
              <span>التسجيل فى منصه {PLATFORM_NAME}</span>
            </a>
          </div>
        </div>

        {/* Step 3: Deposit */}
        <div className="group relative mb-10 pl-12">
          <div className="absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/30 shadow-lg transition-colors group-hover:border-gold">
            <CreditCard className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-gold" />
          </div>

          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-sm transition-colors hover:bg-zinc-900/30">
            <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black/30 p-1.5"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgb3Sh3zdS1zdde4dibdKtH51GMaRsPn8gn8_o7UxnUw&s=10" alt="MELBET logo" className="h-full w-full object-contain" loading="lazy" /></div>
            <h3 className="mb-1 font-display text-base font-bold text-white">إيداع التفعيل</h3>
            <p className="mb-4 text-xs leading-relaxed text-zinc-500">
              الحد الأدنى للإيداع لتنشيط المحفظة وربط السكربت (الأموال تبقى في رصيدك)
            </p>

            <div className="grid grid-cols-2 gap-3" dir="ltr">
              <div className="group/card relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-zinc-700/50 bg-gradient-to-br from-zinc-800 to-zinc-900 p-3 transition-colors hover:border-gold/30">
                <div className="absolute right-0 top-0 p-1 opacity-20 group-hover/card:opacity-40">
                  <span className="font-display text-[40px] font-black leading-none text-white">$</span>
                </div>
                <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">USD</span>
                <span className="font-display text-xl font-bold text-white">$6.00</span>
              </div>
              <div className="group/card relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-zinc-700/50 bg-gradient-to-br from-zinc-800 to-zinc-900 p-3 transition-colors hover:border-gold/30">
                <div className="absolute right-0 top-0 p-1 opacity-20 group-hover/card:opacity-40">
                  <span className="font-display text-[40px] font-black leading-none text-white">D</span>
                </div>
                <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">دينار</span>
                <span className="font-display text-xl font-bold text-white">1,500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Verification */}
        <div className="group relative pl-12">
          <div className="absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/30 shadow-lg transition-colors group-hover:border-gold">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-gold" />
          </div>

          <div
            className={`rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 ${
              hasError ? 'border-red-500/30 bg-red-500/5' : 'border-gold/20 bg-gold/5'
            }`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black/30 p-1.5"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgb3Sh3zdS1zdde4dibdKtH51GMaRsPn8gn8_o7UxnUw&s=10" alt="MELBET logo" className="h-full w-full object-contain" loading="lazy" /></div>
                <h3 className="font-display text-base font-bold text-white">توثيق الحساب</h3>
              </div>
              {hasError && (
                <div className="flex animate-pulse items-center gap-1.5 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase">Required</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* ID */}
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  الـ ID الخاص بك في {PLATFORM_NAME}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={userId}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length <= 15) setUserId(val);
                      if (val) setErrors((p) => ({ ...p, userId: false }));
                    }}
                    placeholder="ID: 83920192"
                    maxLength={15}
                    dir="ltr"
                    className={`w-full rounded-xl border bg-zinc-900/30 px-4 py-3.5 text-sm text-white transition-all placeholder:text-zinc-600 focus:outline-none ${
                      errors.userId ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-700/50 focus:border-gold'
                    }`}
                  />
                  <User className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                </div>
              </div>

              {/* Telegram */}
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  يوزر التيليجرام
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={telegramUser}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val && !val.startsWith('@')) val = '@' + val;
                      setTelegramUser(val);
                      if (val.length > 1) setErrors((p) => ({ ...p, telegram: false }));
                    }}
                    placeholder="@username"
                    dir="ltr"
                    className={`w-full rounded-xl border bg-zinc-900/30 px-4 py-3.5 text-sm text-white transition-all placeholder:text-zinc-600 focus:outline-none ${
                      errors.telegram
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-zinc-700/50 focus:border-gold'
                    }`}
                  />
                  <Send className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                </div>
                {checkingTg && (
                  <p className="mt-1.5 text-[10px] font-bold text-gold">جار التحقق من وجود اليوزر على تيليجرام...</p>
                )}
                {tgError && <p className="mt-1.5 text-[10px] font-bold text-red-500">{tgError}</p>}
              </div>

              {/* Game Selection Cards */}
              <div className="pt-1">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    اختر اللعبة (مطلوب)
                  </span>
                  {errors.game && (
                    <span className="animate-pulse text-[10px] font-bold text-red-500">يرجى اختيار لعبة</span>
                  )}
                </div>

                <div className="grid w-full grid-cols-2 gap-2">
                  {games.map((g) => (
                    <div
                      key={g.key}
                      onClick={() => {
                        setSelectedGame(g.key);
                        setErrors((p) => ({ ...p, game: false }));
                      }}
                      className={`group relative flex h-[60px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border bg-zinc-900/30 p-1 shadow-md transition-all duration-300 ${
                        selectedGame === g.key
                          ? 'border-gold shadow-[0_0_20px_rgba(255,191,0,0.4)] ring-2 ring-gold/50'
                          : errors.game
                            ? 'border-red-500/80'
                            : 'border-white hover:border-gold-soft'
                      }`}
                    >
                      <img
                        src={g.img}
                        alt={g.label}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
                      <span className="relative z-10 text-center font-sans text-[10px] font-black uppercase leading-tight tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] sm:text-xs">
                        {g.label}
                      </span>
                      {selectedGame === g.key && (
                        <div className="absolute right-1 top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-gold font-bold text-black shadow-lg">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Screenshots */}
              <div className="pt-1">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  صور الإثبات (صورة الإيداع وصورة الـ ID)
                </span>

                <input
                  ref={depositInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f)
                      readImage(f, (d, n, originalFile) => {
                        setDepositImg(d);
                        setDepositImgName(n);
                        setDepositFile(originalFile);
                      });
                  }}
                />
                <input
                  ref={idInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f)
                      readImage(f, (d, n, originalFile) => {
                        setIdImg(d);
                        setIdImgName(n);
                        setIdFile(originalFile);
                      });
                  }}
                />

                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: 'صورة الإيداع',
                      img: depositImg,
                      name: depositImgName,
                      ref: depositInputRef,
                      clear: () => {
                        setDepositImg(null);
                        setDepositImgName(null);
                        setDepositFile(null);
                      },
                    },
                    {
                      label: 'صورة الـ ID',
                      img: idImg,
                      name: idImgName,
                      ref: idInputRef,
                      clear: () => {
                        setIdImg(null);
                        setIdImgName(null);
                        setIdFile(null);
                      },
                    },
                  ].map((box) => (
                    <div
                      key={box.label}
                      onClick={() => box.ref.current?.click()}
                      className={`relative flex h-[90px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border bg-zinc-900/30 p-2 text-center transition-all ${
                        box.img ? 'border-gold/60' : 'border-dashed border-zinc-700 hover:border-gold'
                      }`}
                    >
                      {box.img ? (
                        <>
                          <img src={box.img} alt={box.label} className="absolute inset-0 h-full w-full object-cover opacity-40" />
                          <div className="relative z-10 flex flex-col items-center">
                            <Check className="h-4 w-4 text-gold" />
                            <span className="mt-1 max-w-[90px] truncate text-[9px] font-bold text-white">
                              {box.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              box.clear();
                            }}
                            className="absolute right-1 top-1 z-20 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/30 text-zinc-300 transition-colors hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-zinc-500" />
                          <span className="mt-1.5 text-[10px] font-bold text-zinc-400">{box.label}</span>
                          <span className="mt-0.5 text-[9px] text-zinc-600">اضغط للاختيار</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => void validateAndSubmit()}
              disabled={checkingTg}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white py-4 font-display text-sm font-black tracking-wide text-black shadow-[0_10px_30px_-12px_rgba(255,255,255,0.35)] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              <span>{checkingTg ? 'جار التحقق...' : 'إرسال التوثيق واستلام الكود'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <VerificationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        userId={userId}
        telegramUser={telegramUser}
        selectedGame={selectedGame ?? 'apple'}
        depositImage={depositFile}
        idImage={idFile}
      />
    </div>
  );
};
