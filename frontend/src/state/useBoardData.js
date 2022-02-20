import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { cardsEndpoint } from "../config";
import { partition } from "../lib/board";
import { boardAtom, cardsAsset } from "./atoms";

/**
 * Suspends the tree until the card list resolves, then seeds the board once.
 * Hydration lives here rather than in the columns so the two columns cannot
 * race each other into overwriting swipes made during the first render.
 */
export function useBoardData() {
  const cards = cardsAsset.read(cardsEndpoint);
  const setBoard = useSetRecoilState(boardAtom);

  useEffect(() => {
    setBoard(partition(cards));
  }, [cards, setBoard]);
}
