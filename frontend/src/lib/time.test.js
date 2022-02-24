import { relativeTime } from "./time";

const NOW = Date.parse("2022-02-20T12:00:00Z");
const ago = ms => new Date(NOW - ms).toISOString();

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("relativeTime", () => {
  it("collapses anything under a minute to 'now'", () => {
    expect(relativeTime(ago(20 * 1000), NOW)).toBe("now");
  });

  it("picks the coarsest unit that fits rather than the smallest", () => {
    expect(relativeTime(ago(3 * DAY), NOW)).toBe("3 days ago");
    expect(relativeTime(ago(5 * HOUR), NOW)).toBe("5 hours ago");
  });

  it("rounds to the nearest whole unit at a boundary", () => {
    expect(relativeTime(ago(45 * DAY), NOW)).toBe("2 months ago");
  });

  it("rounds the past and the future symmetrically at a .5 boundary", () => {
    expect(relativeTime(new Date(NOW + 45 * DAY).toISOString(), NOW)).toBe("in 2 months");
  });

  it("handles future timestamps without printing a negative count", () => {
    expect(relativeTime(new Date(NOW + 2 * DAY).toISOString(), NOW)).toBe("in 2 days");
  });

  it("accepts the offset form the API emits, not just Z-suffixed ISO", () => {
    expect(relativeTime("2022-02-19T12:00:00+0000", NOW)).toBe("yesterday");
  });

  it("degrades to 'unknown' on an unparseable date instead of NaN", () => {
    expect(relativeTime("not-a-date", NOW)).toBe("unknown");
  });
});
