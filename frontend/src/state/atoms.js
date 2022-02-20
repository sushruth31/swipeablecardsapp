import axios from "axios";
import { atom, selector } from "recoil";
import { createAsset } from "use-asset";
import { visiblePending } from "../lib/board";

/** Suspense-integrated cache; `read` throws a promise until the fetch settles. */
export const cardsAsset = createAsset(async url => (await axios.get(url)).data);

/** Both columns live in one atom so a swipe is a single atomic transition. */
export const boardAtom = atom({
  key: "board",
  default: { pending: [], done: [] },
});

export const searchAtom = atom({
  key: "search",
  default: "",
});

export const visiblePendingSelector = selector({
  key: "visiblePending",
  get: ({ get }) => visiblePending(get(boardAtom), get(searchAtom)),
});
