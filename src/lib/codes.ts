const BASE = 'https://teslax-66c1a-default-rtdb.firebaseio.com/dollar';

export interface CodeEntry {
  id: string;
  code: string;
  durationLabel: string;
  durationMs: number | null; // null = lifetime
  createdAt: number;
  expiresAt: number | null;
  active: boolean;
}

export const DURATIONS: { label: string; ms: number | null }[] = [
  { label: '30 دقيقة', ms: 30 * 60 * 1000 },
  { label: 'ساعة واحدة', ms: 60 * 60 * 1000 },
  { label: '12 ساعة', ms: 12 * 60 * 60 * 1000 },
  { label: '24 ساعة', ms: 24 * 60 * 60 * 1000 },
  { label: '7 أيام', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: 'مدى الحياة', ms: null },
];

export const isExpired = (c: CodeEntry) => c.expiresAt !== null && c.expiresAt < Date.now();

export async function listCodes(): Promise<CodeEntry[]> {
  const res = await fetch(`${BASE}.json`);
  if (!res.ok) throw new Error('Firebase read failed');
  const data = (await res.json()) as Record<string, Omit<CodeEntry, 'id'>> | null;
  if (!data) return [];
  return Object.entries(data)
    .map(([id, v]) => ({ ...v, id }))
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export async function createCode(code: string, duration: { label: string; ms: number | null }) {
  const now = Date.now();
  const body: Omit<CodeEntry, 'id'> = {
    code,
    durationLabel: duration.label,
    durationMs: duration.ms,
    createdAt: now,
    expiresAt: duration.ms === null ? null : now + duration.ms,
    active: true,
  };
  const res = await fetch(`${BASE}.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Firebase write failed');
  return res.json();
}

export async function updateCode(id: string, patch: Partial<CodeEntry>) {
  const res = await fetch(`${BASE}/${id}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Firebase update failed');
}

export async function deleteCode(id: string) {
  const res = await fetch(`${BASE}/${id}.json`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Firebase delete failed');
}

export function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `DZ-${part(4)}-${part(4)}`;
}

/* ---------- local session ---------- */

const SESSION_KEY = 'mrdollar_session';

export interface Session {
  code: string;
  expiresAt: number | null;
}

export function saveSession(s: Session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function formatRemaining(ms: number) {
  if (ms <= 0) return '00:00:00';
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d > 0 ? `${d}d ` : ''}${pad(h)}:${pad(m)}:${pad(s)}`;
}
