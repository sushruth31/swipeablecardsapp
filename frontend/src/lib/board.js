/**
 * Pure board rules. No React, no network, no Recoil — everything in here is a
 * plain function of (board, args) so the triage semantics can be tested directly.
 *
 * A board is `{ pending: Card[], done: Card[] }`.
 * A card is `{ id, title, tags: string[], createdAt, status }`.
 */

export const PENDING = "PENDING";
export const DONE = "DONE";

/**
 * Split a flat card list into the two columns, preserving server order.
 * Any status that is not DONE (PENDING, BLOCKED, ...) still needs triage.
 */
export const partition = cards => ({
  pending: cards.filter(({ status }) => status !== DONE),
  done: cards.filter(({ status }) => status === DONE),
});

/** Case-insensitive match over the title and every tag. A blank query matches all. */
export const matchesQuery = ({ title, tags }, query) => {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return title.toLowerCase().includes(needle) || tags.some(tag => tag.toLowerCase().includes(needle));
};

/**
 * Cards the pending column should render: not already completed, matching search.
 * Completion is keyed on `id` — titles are display text and may repeat.
 */
export const visiblePending = ({ pending, done }, query) => {
  const completed = new Set(done.map(({ id }) => id));
  return pending.filter(card => !completed.has(card.id) && matchesQuery(card, query));
};

const move = (board, from, to, id, status) => {
  const card = board[from].find(candidate => candidate.id === id);
  if (!card) return board;
  return {
    [from]: board[from].filter(candidate => candidate.id !== id),
    [to]: [...board[to].filter(candidate => candidate.id !== id), { ...card, status }],
  };
};

/** Move a pending card to done. Unknown ids are a no-op; repeats cannot duplicate. */
export const completeCard = (board, id) => move(board, "pending", "done", id, DONE);

/** Send a completed card back for triage, clearing whatever status it carried before. */
export const reopenCard = (board, id) => move(board, "done", "pending", id, PENDING);

/**
 * Translate a swipe into a transition: right completes, left reopens.
 * Vertical swipes and unknown directions leave the board untouched.
 */
export const applySwipe = (board, id, direction) => {
  if (direction === "right") return completeCard(board, id);
  if (direction === "left") return reopenCard(board, id);
  return board;
};
