const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Coarsest unit first; months and years are the usual calendar approximations.
const UNITS = [
  ["year", 365 * DAY],
  ["month", 30 * DAY],
  ["day", DAY],
  ["hour", HOUR],
  ["minute", MINUTE],
];

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/**
 * "3 days ago" style label for an ISO timestamp, using the coarsest unit that fits.
 * Replaces a moment.js dependency with the platform's Intl formatter.
 */
export const relativeTime = (isoDate, now = Date.now()) => {
  const deltaMs = new Date(isoDate).getTime() - now;
  if (Number.isNaN(deltaMs)) return "unknown";

  const unit = UNITS.find(([, size]) => Math.abs(deltaMs) >= size);
  if (!unit) return formatter.format(0, "second");

  // Round the magnitude, then reapply the sign: Math.round(-1.5) is -1, which
  // would make past timestamps round differently from future ones.
  const [name, size] = unit;
  return formatter.format(Math.sign(deltaMs) * Math.round(Math.abs(deltaMs) / size), name);
};
