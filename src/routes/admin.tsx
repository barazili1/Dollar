import { createFileRoute, Link } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Copy, Crown, RefreshCw, Shuffle, Trash2 } from 'lucide-react';
import {
  CodeEntry,
  DURATIONS,
  createCode,
  deleteCode,
  isExpired,
  listCodes,
  randomCode,
  updateCode,
} from '@/lib/codes';
import { ParticlesBackground } from '@/components/ParticlesBackground';

function AdminPanel() {
  const [codeText, setCodeText] = useState('');
  const [durationIdx, setDurationIdx] = useState(0);
  const [codes, setCodes] = useState<CodeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      setCodes(await listCodes());
    } catch {
      setError('تعذر الاتصال بقاعدة البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleSave = async () => {
    const code = codeText.trim().toUpperCase();
    if (!code) {
      setError('أدخل نص كود المرور أولاً');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createCode(code, DURATIONS[durationIdx]!);
      setCodeText('');
      await refresh();
    } catch {
      setError('فشل حفظ الكود، حاول مرة أخرى');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (c: CodeEntry) => {
    navigator.clipboard.writeText(c.code);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const activeCount = codes.filter((c) => c.active && !isExpired(c)).length;

  return (
    <div className="relative min-h-screen bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,191,0,0.10),transparent_60%)] bg-black/30 text-white lux-grain" dir="rtl">
      <ParticlesBackground accent="gold" />

      <div className="relative z-10 mx-auto w-full max-w-[560px] px-4 pb-16 pt-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-gold/25 bg-ink-2/50 px-3.5 py-2 text-[11px] font-bold text-neutral-200 backdrop-blur-xl transition-colors hover:border-gold hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            خروج
          </Link>

          <div className="text-left">
            <h1 className="font-display text-2xl font-black tracking-tight text-gold drop-shadow-[0_0_18px_rgba(255,191,0,0.35)]">
              لوحة تحكم الأكواد
            </h1>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60">
              MR DOLLAR VIP PANEL
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {[
            { label: 'كل الأكواد', value: codes.length },
            { label: 'أكواد نشطة', value: activeCount },
            { label: 'منتهية / موقوفة', value: codes.length - activeCount },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gold/15 bg-ink/60 px-3 py-3 text-center backdrop-blur-xl"
            >
              <div className="font-display text-xl font-black text-gold">{s.value}</div>
              <div className="mt-0.5 text-[9px] font-bold tracking-wide text-neutral-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 h-px w-full bg-gradient-to-l from-gold/50 via-gold/10 to-transparent" />


        {/* Generator */}
        <div className="mt-6 rounded-[26px] border border-gold/20 bg-ink/70 p-5 shadow-[0_0_40px_-24px_rgba(255,191,0,0.6)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="rounded-lg border border-gold/25 bg-gold/10 px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-gold">
              generator
            </span>
            <h2 className="font-display text-lg font-black text-white">إنشاء مفتاح مرور جديد</h2>
          </div>

          <p className="mt-5 text-[12px] font-medium text-neutral-400">:أدخل نص كود المرور</p>
          <div className="mt-2 grid grid-cols-[auto_1fr] gap-3">
            <button
              type="button"
              onClick={() => setCodeText(randomCode())}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gold/60 bg-gold/10 px-4 text-[12px] font-black tracking-widest text-gold transition-all hover:bg-gold/20 active:scale-[0.98]"
            >
              <Shuffle className="h-3.5 w-3.5" />
              توليد عشوائي
            </button>
            <input
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              placeholder="مثال : HARF-7738-VIP"
              dir="ltr"
              className="h-14 w-full rounded-xl border border-gold/20 bg-ink-2/50 px-4 text-center font-mono text-[15px] tracking-[0.14em] text-white placeholder:text-neutral-600 outline-none transition-all focus:border-gold/70"
            />
          </div>

          <p className="mt-5 text-[12px] font-medium text-neutral-400">:اختر مدة صلاحية الكود</p>
          <div className="mt-2 grid grid-cols-3 gap-2.5">
            {DURATIONS.map((d, i) => {
              const active = i === durationIdx;
              return (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => setDurationIdx(i)}
                  className={`h-14 cursor-pointer rounded-xl border text-[12px] font-bold transition-all ${
                    active
                      ? 'border-gold bg-black/30 text-white shadow-[0_0_18px_-6px_rgba(255,191,0,0.6)]'
                      : 'border-hair bg-ink-2/40 text-neutral-400 hover:border-gold/40 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {error && <p className="mt-4 text-center text-[11px] font-bold text-destructive">{error}</p>}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-5 flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-gold-deep via-gold to-gold-soft font-display text-[15px] font-black text-black shadow-[0_14px_38px_-16px_rgba(255,191,0,0.8)] transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
          >
            <Crown className="h-4 w-4" />
            {saving ? 'جار الحفظ...' : 'حفظ وتفعيل الكود بالسيرفر'}
          </button>
        </div>

        {/* Active keys */}
        <div className="mt-6 rounded-[26px] border border-gold/20 bg-ink/70 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => void refresh()}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-hair bg-ink-2/50 text-neutral-300 transition-colors hover:border-gold hover:text-gold"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="rounded-lg border border-gold/25 bg-gold/10 px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-gold">
                active_keys
              </span>
              <h2 className="font-display text-base font-black text-white">الأكواد الفعالة ومفاتيح المرور</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {codes.length === 0 && !loading && (
              <p className="py-6 text-center text-[12px] text-neutral-500">لا توجد أكواد محفوظة بعد</p>
            )}

            {codes.map((c) => {
              const expired = isExpired(c) || !c.active;
              return (
                <div
                  key={c.id}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 ${
                    expired ? 'border-gold/15 bg-ink-2/30' : 'border-emerald-500/25 bg-emerald-500/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(c)}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-hair bg-ink-3/25 text-neutral-300 transition-colors hover:text-white"
                    >
                      {copiedId === c.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await updateCode(c.id, { active: !c.active });
                        void refresh();
                      }}
                      className="h-10 cursor-pointer rounded-xl border border-gold/40 bg-gold/10 px-3.5 text-[12px] font-bold text-gold transition-colors hover:bg-gold/20"
                    >
                      {c.active ? 'إيقاف' : 'تشغيل'}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteCode(c.id);
                        void refresh();
                      }}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-gold/30 bg-gold/[0.06] text-gold transition-colors hover:bg-gold/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-left">
                    <div className="font-mono text-[14px] font-black tracking-wider text-white" dir="ltr">
                      {c.code}
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-black ${
                          expired ? 'bg-gold/10 text-gold' : 'bg-emerald-500/15 text-emerald-400'
                        }`}
                      >
                        {expired ? 'منتهي' : 'نشط'}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-neutral-600" />
                      <span className="font-mono text-[10px] tracking-widest text-neutral-500">{c.durationLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'لوحة تحكم الأكواد | MR DOLLAR VIP' },
      { name: 'description', content: 'إنشاء وإدارة أكواد الدخول ومفاتيح المرور الخاصة بسكربت MR DOLLAR VIP.' },
      { property: 'og:title', content: 'لوحة تحكم الأكواد | MR DOLLAR VIP' },
      { property: 'og:description', content: 'إنشاء وإدارة أكواد الدخول ومدة صلاحيتها.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: AdminPanel,
});
