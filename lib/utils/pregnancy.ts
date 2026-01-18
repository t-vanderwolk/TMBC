export const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
export const TOTAL_PREGNANCY_WEEKS = 40;

export type PregnancyProgress = {
  week: number;
  day: number;
  percent: number;
  rawWeeks: number;
} | null;

const toDate = (value?: string | Date | null) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const calculatePregnancyProgress = (dueDate?: string | Date | null): PregnancyProgress => {
  const parsed = toDate(dueDate);
  if (!parsed) return null;
  const totalWeeks = TOTAL_PREGNANCY_WEEKS;
  const now = new Date();
  const weeksRemaining = (parsed.getTime() - now.getTime()) / MS_PER_WEEK;
  const weeksSoFar = Math.min(totalWeeks, Math.max(0, totalWeeks - weeksRemaining));
  const week = Math.min(totalWeeks, Math.max(1, Math.floor(weeksSoFar) + 1));
  const dayProgress = weeksSoFar - Math.floor(weeksSoFar);
  const day = Math.min(7, Math.max(1, Math.ceil(dayProgress * 7)));

  return {
    week,
    day,
    percent: Number.isFinite(weeksSoFar) ? weeksSoFar / totalWeeks : 0,
    rawWeeks: weeksSoFar,
  };
};

export const getTrimesterLabel = (week?: number | null) => {
  if (!week) return 'Pregnancy';
  if (week <= 13) return 'First Trimester';
  if (week <= 27) return 'Second Trimester';
  return 'Third Trimester';
};

export const getDateForGestationalWeek = (dueDate?: string | Date | null, targetWeek?: number | null) => {
  const parsed = toDate(dueDate);
  if (!parsed || !targetWeek) return null;
  const weeksUntilTarget = TOTAL_PREGNANCY_WEEKS - targetWeek;
  const targetTime = parsed.getTime() - weeksUntilTarget * MS_PER_WEEK;
  if (Number.isNaN(targetTime)) return null;
  return new Date(targetTime).toISOString();
};
