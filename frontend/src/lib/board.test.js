import {
  DONE,
  PENDING,
  applySwipe,
  completeCard,
  matchesQuery,
  partition,
  reopenCard,
  visiblePending,
} from "./board";

const card = (id, overrides = {}) => ({
  id,
  title: `Card ${id}`,
  tags: ["infra"],
  createdAt: "2022-02-10T09:00:00Z",
  status: PENDING,
  ...overrides,
});

const board = (pending, done = []) => ({ pending, done });

describe("partition", () => {
  it("puts every non-DONE status in the pending column, not just PENDING", () => {
    const cards = [card(1), card(2, { status: "BLOCKED" }), card(3, { status: DONE })];
    expect(partition(cards).pending.map(({ id }) => id)).toEqual([1, 2]);
    expect(partition(cards).done.map(({ id }) => id)).toEqual([3]);
  });

  it("preserves server order within each column", () => {
    const cards = [card(9), card(4, { status: DONE }), card(7), card(2, { status: DONE })];
    expect(partition(cards).pending.map(({ id }) => id)).toEqual([9, 7]);
    expect(partition(cards).done.map(({ id }) => id)).toEqual([4, 2]);
  });
});

describe("matchesQuery", () => {
  const subject = card(1, { title: "Rotate Staging Credentials", tags: ["Security", "infra"] });

  it("matches the title case-insensitively", () => {
    expect(matchesQuery(subject, "STAGING")).toBe(true);
  });

  it("matches on any tag, not only the first", () => {
    expect(matchesQuery(subject, "infra")).toBe(true);
  });

  it("matches a tag whose case differs from the query", () => {
    expect(matchesQuery(subject, "security")).toBe(true);
  });

  it("treats a blank or whitespace-only query as no filter", () => {
    expect(matchesQuery(subject, "")).toBe(true);
    expect(matchesQuery(subject, "   ")).toBe(true);
  });

  it("ignores surrounding whitespace the user typed", () => {
    expect(matchesQuery(subject, "  rotate  ")).toBe(true);
  });

  it("rejects a query that appears in neither title nor tags", () => {
    expect(matchesQuery(subject, "billing")).toBe(false);
  });
});

describe("visiblePending", () => {
  it("reads only the pending column, never subtracting the done one", () => {
    const state = board([card(1), card(2)], [card(3, { status: DONE })]);
    expect(visiblePending(state, "").map(({ id }) => id)).toEqual([1, 2]);
  });

  it("applies the search filter to the pending column", () => {
    const state = board([card(1, { title: "Deploy" }), card(2, { title: "Rollback" })]);
    expect(visiblePending(state, "roll").map(({ id }) => id)).toEqual([2]);
  });
});

describe("completeCard", () => {
  it("moves the card across and stamps it DONE", () => {
    const next = completeCard(board([card(1), card(2)]), 1);
    expect(next.pending.map(({ id }) => id)).toEqual([2]);
    expect(next.done).toEqual([expect.objectContaining({ id: 1, status: DONE })]);
  });

  it("appends to the bottom of the done stack so the newest card lands on top", () => {
    const next = completeCard(board([card(3)], [card(1, { status: DONE })]), 3);
    expect(next.done.map(({ id }) => id)).toEqual([1, 3]);
  });

  it("returns the same board for an id that is not pending", () => {
    const state = board([card(1)], [card(2, { status: DONE })]);
    expect(completeCard(state, 99)).toBe(state);
    expect(completeCard(state, 2)).toBe(state);
  });

  it("does not mutate the board it was given", () => {
    const pending = [card(1)];
    const state = board(pending);
    completeCard(state, 1);
    expect(pending.map(({ id }) => id)).toEqual([1]);
    expect(state.done).toEqual([]);
  });

  it("completes the card with the matching id, not the one sharing its title", () => {
    const next = completeCard(board([card(1, { title: "Deploy" }), card(2, { title: "Deploy" })]), 2);
    expect(next.pending.map(({ id }) => id)).toEqual([1]);
    expect(next.done.map(({ id }) => id)).toEqual([2]);
  });

  it("treats id 0 as a real card rather than a falsy miss", () => {
    const next = completeCard(board([card(0)]), 0);
    expect(next.pending).toEqual([]);
    expect(next.done.map(({ id }) => id)).toEqual([0]);
  });
});

describe("reopenCard", () => {
  it("moves the card back and resets the status to PENDING", () => {
    const next = reopenCard(board([], [card(1, { status: DONE })]), 1);
    expect(next.done).toEqual([]);
    expect(next.pending).toEqual([expect.objectContaining({ id: 1, status: PENDING })]);
  });

  it("clears a pre-completion BLOCKED status instead of restoring it", () => {
    const completed = completeCard(board([card(1, { status: "BLOCKED" })]), 1);
    expect(reopenCard(completed, 1).pending[0].status).toBe(PENDING);
  });

  it("never leaves a duplicate behind on a complete/reopen round trip", () => {
    const start = board([card(1), card(2)]);
    const roundTrip = reopenCard(completeCard(start, 1), 1);
    expect(roundTrip.done).toEqual([]);
    expect(roundTrip.pending.map(({ id }) => id)).toEqual([2, 1]);
  });
});

describe("applySwipe", () => {
  const state = board([card(1)], [card(2, { status: DONE })]);

  it("completes on a right swipe", () => {
    expect(applySwipe(state, 1, "right").done.map(({ id }) => id)).toEqual([2, 1]);
  });

  it("reopens on a left swipe", () => {
    expect(applySwipe(state, 2, "left").pending.map(({ id }) => id)).toEqual([1, 2]);
  });

  it("ignores vertical and unrecognised directions", () => {
    expect(applySwipe(state, 1, "up")).toBe(state);
    expect(applySwipe(state, 1, "down")).toBe(state);
    expect(applySwipe(state, 1, undefined)).toBe(state);
  });
});
