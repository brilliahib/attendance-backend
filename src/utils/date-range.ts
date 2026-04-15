import { isValid, parseISO } from 'date-fns';

const JAKARTA_OFFSET_MINUTES = 7 * 60;

function toJakartaBoundary(dateString: string, endOfDay = false) {
  const parsed = parseISO(dateString);

  if (!isValid(parsed)) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  const year = parsed.getFullYear();
  const month = parsed.getMonth();
  const day = parsed.getDate();

  const hour = endOfDay ? 23 : 0;
  const minute = endOfDay ? 59 : 0;
  const second = endOfDay ? 59 : 0;
  const millisecond = endOfDay ? 999 : 0;

  const utcMs =
    Date.UTC(year, month, day, hour, minute, second, millisecond) -
    JAKARTA_OFFSET_MINUTES * 60_000;

  return new Date(utcMs);
}

export function toJakartaUtcDateRange(dateFrom?: string, dateTo?: string) {
  if (!dateFrom && !dateTo) return undefined;

  const from = dateFrom ?? dateTo!;
  const to = dateTo ?? dateFrom!;

  return {
    gte: toJakartaBoundary(from, false),
    lte: toJakartaBoundary(to, true),
  };
}
