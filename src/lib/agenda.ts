// Regras de horários — visível para cliente e servidor.
export const SLOT_TIMES = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
] as const;

export type SlotTime = (typeof SLOT_TIMES)[number];

/** Segunda (1) a Sábado (6). Domingo (0) fora. */
export function isWorkingDay(date: Date): boolean {
  const d = date.getDay();
  return d >= 1 && d <= 6;
}

/** yyyy-mm-dd sem timezone shenanigans. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Retorna as 6 datas úteis (seg-sáb) da semana que contém `ref`. */
export function weekDates(ref: Date): Date[] {
  const day = ref.getDay(); // 0=dom
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(date.getDate() + n);
  return d;
}

export function formatBR(date: Date): string {
  return date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

export function formatBRFull(date: Date): string {
  return date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

/** Normaliza HH:MM ou HH:MM:SS para HH:MM. */
export function normalizeTime(t: string): string {
  return t.slice(0, 5);
}

/** Valida WhatsApp brasileiro: (XX) 9XXXX-XXXX ou 11 dígitos. */
export function isValidBRWhatsApp(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  // 10 (fixo antigo) ou 11 (celular com 9)
  if (digits.length !== 10 && digits.length !== 11) return false;
  const ddd = Number(digits.slice(0, 2));
  return ddd >= 11 && ddd <= 99;
}

export function onlyDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}
