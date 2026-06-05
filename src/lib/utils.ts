// Simplified cn utility (no tailwind-merge dependency needed for our use case)
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

// Generate a URL-friendly slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 30)
    + '-' + Math.random().toString(36).slice(2, 8);
}

// Format a date to relative time
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

// Calculate time between two dates for countdown
export function getTimeBetween(startDate: string): {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const start = new Date(startDate);
  const now = new Date();
  let diff = Math.abs(now.getTime() - start.getTime());

  const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  diff -= years * 365.25 * 24 * 60 * 60 * 1000;
  const months = Math.floor(diff / (30.44 * 24 * 60 * 60 * 1000));
  diff -= months * 30.44 * 24 * 60 * 60 * 1000;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  diff -= days * 24 * 60 * 60 * 1000;
  const hours = Math.floor(diff / (60 * 60 * 1000));
  diff -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(diff / (60 * 1000));
  diff -= minutes * 60 * 1000;
  const seconds = Math.floor(diff / 1000);

  return { years, months, days, hours, minutes, seconds };
}
