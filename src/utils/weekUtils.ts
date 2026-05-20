/**
 * Week range and calendar mathematical utilities
 */

// A week in milliseconds: 7 days * 24 hours * 60 minutes * 60 seconds * 1000 ms
export const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Calculates the absolute week index from birthdate to a given date.
 */
export function getWeekIndex(birthdate: Date, targetDate: Date = new Date()): number {
  const diffMs = targetDate.getTime() - birthdate.getTime();
  if (diffMs < 0) return 0;
  return Math.floor(diffMs / WEEK_IN_MS);
}

/**
 * Gets the start and end dates for a specific week index relative to birthdate.
 */
export function getWeekDateRange(birthdate: Date, weekIndex: number): { start: Date; end: Date } {
  const startMs = birthdate.getTime() + weekIndex * WEEK_IN_MS;
  const endMs = startMs + (6 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000); // 7 days minus 1 second
  return {
    start: new Date(startMs),
    end: new Date(endMs),
  };
}

/**
 * Formats a Date object as a short string, e.g. "Mar 4, 2019"
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats the full date range of a week, e.g. "Mar 4 – Mar 10, 2019"
 */
export function formatWeekRange(birthdate: Date, weekIndex: number): string {
  const { start, end } = getWeekDateRange(birthdate, weekIndex);
  
  const startFormat = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endFormat = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  // If the years are different
  if (start.getFullYear() !== end.getFullYear()) {
    const startWithYear = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startWithYear} – ${endFormat}`;
  }
  
  return `${startFormat} – ${endFormat}`;
}

/**
 * High-precision live ticking metrics structure
 */
export interface LiveLifeMetrics {
  weeksLived: number;
  weeksRemaining: number;
  percentLived: number;
  ageYears: number;
}

/**
 * Computes high-precision metrics based on current high-resolution timestamp
 */
export function computeLiveMetrics(birthdate: Date, assumedLifespan: number): LiveLifeMetrics {
  const now = new Date();
  const diffMs = now.getTime() - birthdate.getTime();
  
  const exactWeeksLived = Math.max(0, diffMs / WEEK_IN_MS);
  const totalWeeks = assumedLifespan * 52;
  const exactWeeksRemaining = Math.max(0, totalWeeks - exactWeeksLived);
  const percentLived = Math.min(100, Math.max(0, (exactWeeksLived / totalWeeks) * 100));
  
  // Approximate years lived based on standard calendar calculations
  const ageYears = Math.max(0, diffMs / (365.2422 * 24 * 60 * 60 * 1000));
  
  return {
    weeksLived: exactWeeksLived,
    weeksRemaining: exactWeeksRemaining,
    percentLived,
    ageYears,
  };
}
