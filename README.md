# Card Triage — a swipeable two-column card board

A triage board for a queue of cards: swipe right to complete one, swipe left to send a
completed card back for another look. The interesting part is not the animation — it is
keeping the board's rules out of the components, so a gesture, a button click and a test
all drive the same pure state transition.

[![CI](https://github.com/sushruth31/swipeablecardsapp/actions/workflows/ci.yml/badge.svg)](https://github.com/sushruth31/swipeablecardsapp/actions/workflows/ci.yml)

## Stack

- **React 17** (Create React App) — the app is a single screen; a router would be dead weight.
- **Recoil** — the board and the search box are read by three sibling components that are
  not in a parent/child line. Atoms beat threading props through a layout wrapper.
- **react-tinder-card** for the drag/throw gesture, **framer-motion** for enter/exit animation.
- **Tailwind** for layout, **MUI** for the app bar, search field and buttons.
- **json-server** as a throwaway mock API so the client has a real network boundary to load across.

## Running it

Two processes: the mock API and the web client.

```bash
# 1. mock API on :8080
npm install
cp .env.example .env
npm run api

# 2. web client on :3000, in a second shell
cd frontend
npm install
cp .env.example .env
npm start
```

Both `.env` files are required. `frontend/src/config.js` throws on the first import if
`REACT_APP_API_URL` is missing, and the API exits with a named error if `API_PORT` is not
set — neither one silently falls back to a placeholder.

## Architecture

```
server/index.js          json-server over server/cards.json  ──GET /cards──┐
                                                                           │
frontend/src                                                               ▼
├── config.js            reads + validates REACT_APP_API_URL
├── state/
│   ├── atoms.js         boardAtom { pending, done }, searchAtom,
│   │                    visiblePendingSelector (derived), cardsAsset (Suspense fetch)
│   ├── useBoardData.js  suspends on the fetch, seeds the board once
│   └── useSwipes.js     binds a card id to applySwipe via the atom setter
├── lib/
│   ├── board.js         PURE — partition, matchesQuery, visiblePending,
│   │                    completeCard, reopenCard, applySwipe
│   └── time.js          PURE — relativeTime via Intl.RelativeTimeFormat
└── components/          NavBar · CardColumn · Card · Buttons  (render only)
```

Everything under `lib/` is a plain function of its arguments. Nothing under `components/`
decides what a swipe means.

## Design notes

- **One atom, not two.** Both columns live in a single `{ pending, done }` atom, so
  completing a card is one pure `board -> board` transition instead of two setter calls
  that could interleave. `useSwipes` is three lines and uses the updater form of the
  setter deliberately: a fast swipe can fire while a previous transition is still queued,
  and reading the atom directly would apply the second move to a stale board.
- **Identity is the id, never the title.** The visible-pending filter originally excluded
  a card by comparing its display name against the done column, so two cards that happened
  to share a title disappeared together. It now diffs on `id` through a `Set`, which also
  drops the filter from O(P·D) to O(P + D) per keystroke.
- **A component declared inside a component is a remount.** The card's detail panel used to
  be defined in the body of the card component, so React saw a brand-new component *type*
  on every render and threw away the subtree — the expand animation restarted whenever any
  parent state changed. Hoisting it to module scope fixed it; the same reasoning is why the
  framer-motion variants are module constants.
- **Derive once, in a selector.** Search filtering lives in a Recoil selector rather than in
  each column, so the columns and the button bar all read the same memoised result and it is
  recomputed only when the board or the query actually changes.
- **Swiping is guarded in two places.** `preventSwipe` stops a card being thrown in a
  direction that has no meaning for its column, and `applySwipe` independently returns the
  board unchanged for any direction it does not recognise — so a gesture can never animate a
  card off screen without a matching state transition behind it.
- **Bundle cost of a date string.** `moment` was pulled in for one "3 days ago" label.
  Replacing it with a 25-line `Intl.RelativeTimeFormat` helper (plus dropping two unused MUI
  wrappers) took the gzipped main bundle from 168.8 kB to 149.5 kB. The helper rounds the
  *magnitude* and reapplies the sign, because `Math.round(-1.5)` is `-1` and past timestamps
  would otherwise round differently from future ones.

## Tests

```bash
cd frontend && npm test      # 32 tests, jest + React Testing Library
```

- `lib/board.test.js` — the triage rules: non-DONE statuses (`BLOCKED`) still belong to the
  pending column, completion keyed on id rather than title, `id: 0` treated as a real card
  and not a falsy miss, unknown ids returning the identical board object, no duplicate left
  behind on a complete/reopen round trip, and the inputs never mutated.
- `lib/time.test.js` — coarsest-unit selection, `.5` boundaries rounding the same way in the
  past and the future, the `+0000` offset form the API emits, and an unparseable date
  degrading to `"unknown"` instead of `NaN`.
- `state/useSwipes.test.js` — renders the controls against a live Recoil board and asserts a
  click moves the top card between columns, covering the hook and atom wiring that the pure
  tests cannot reach.
