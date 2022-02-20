import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { applySwipe } from "../lib/board";
import { boardAtom } from "./atoms";

/**
 * Binds a card id to the board transitions. The returned handler takes the
 * direction react-tinder-card reports ("left" | "right" | "up" | "down") and is
 * also what the keyboard/button controls call, so gesture and click share one path.
 *
 * The updater form of the setter is deliberate: a fast swipe can fire while a
 * previous transition is still queued, and reading the atom here would apply the
 * second move to a stale board.
 */
export function useSwipes(id) {
  const setBoard = useSetRecoilState(boardAtom);
  return useCallback(direction => setBoard(board => applySwipe(board, id, direction)), [setBoard, id]);
}
