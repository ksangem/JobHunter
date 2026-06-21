// ============================================================================
// Small cross-platform helpers (no platform-specific APIs here).
// ============================================================================

export function formatCurrency(amount: number, currency = 'INR'): string {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string, withTime = false): string {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = withTime
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat('en-IN', opts).format(d);
}

export function relativeTime(iso: string, now: number = Date.now()): string {
  const diff = now - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.round(hr / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/** Mask an email/phone for cross-org PII isolation (G-025). */
export function maskEmail(email?: string | null): string {
  if (!email) return '••••••';
  const [user, domain] = email.split('@');
  if (!domain || !user) return '••••••';
  return `${user.slice(0, 2)}•••@${domain}`;
}

export function maskPhone(phone?: string | null): string {
  if (!phone) return '••••••';
  return `${phone.slice(0, 3)}•••••${phone.slice(-2)}`;
}

export function scoreColor(score: number): 'success' | 'warning' | 'danger' {
  if (score >= 75) return 'success';
  if (score >= 50) return 'warning';
  return 'danger';
}

/** Deterministic pseudo-random for stable mock data (no Math.random at import). */
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
