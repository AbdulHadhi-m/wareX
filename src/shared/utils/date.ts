export function now(): Date {
  return new Date();
}

export function toISOString(date: Date = now()): string {
  return date.toISOString();
}

export function addMinutes(date: Date, minutes: number): Date {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function diffInMinutes(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / 60000;
}
