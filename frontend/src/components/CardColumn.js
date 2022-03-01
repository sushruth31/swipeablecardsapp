import { AnimatePresence, motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { boardAtom, visiblePendingSelector } from "../state/atoms";
import { Card } from "./Card";

const HEADINGS = { pending: "To do", done: "Done" };
const EDGES = { pending: "border-r", done: "border-l" };

const SECTION_STYLE = "flex h-screen flex-col items-center justify-center border-gray-400";
const PLACEHOLDER_STYLE = "absolute mb-[50px] flex h-52 items-center justify-center rounded-xl bg-blue-300";
const PLACEHOLDER = { initial: { width: 0 }, animate: { width: 300 }, exit: { width: 0 } };

export function CardColumn({ column }) {
  const { done } = useRecoilValue(boardAtom);
  const pending = useRecoilValue(visiblePendingSelector);
  const cards = column === "pending" ? pending : done;

  return (
    <section style={{ flex: "0.45" }} className={`${SECTION_STYLE} ${EDGES[column]}`}>
      <h2 className="-mt-[600px] text-xl font-bold text-black">{HEADINGS[column]}</h2>
      {/* AnimatePresence has to sit outside the ternary: wrapped around the
          placeholder alone it would unmount with it and never run the exit. */}
      <AnimatePresence initial={false}>
        {cards.length === 0 ? (
          <motion.div key="empty" {...PLACEHOLDER} className={PLACEHOLDER_STYLE}>
            No more cards
          </motion.div>
        ) : (
          cards.map(card => <Card key={card.id} column={column} {...card} />)
        )}
      </AnimatePresence>
    </section>
  );
}
