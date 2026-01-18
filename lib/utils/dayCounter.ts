const DAY_IN_MS = 1000 * 60 * 60 * 24;

export function getPregnancyDay(startDate?: string | Date | null): number {
  if (!startDate) {
    return 1;
  }

  const parsed = startDate instanceof Date ? startDate : new Date(startDate);
  if (Number.isNaN(parsed.getTime())) {
    return 1;
  }

  const today = new Date();
  const diffMs = today.getTime() - parsed.getTime();
  const diffDays = Math.floor(diffMs / DAY_IN_MS);

  return Math.max(diffDays + 1, 1);
}
