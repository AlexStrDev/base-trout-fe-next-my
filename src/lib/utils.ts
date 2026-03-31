import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-PE').format(n);
}

export function formatWeight(g: number): string {
  if (g >= 1000) return `${(g / 1000).toFixed(2)} kg`;
  return `${g.toFixed(1)} g`;
}

export function getUserId(): string {
  return process.env.NEXT_PUBLIC_USER_ID || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
}
