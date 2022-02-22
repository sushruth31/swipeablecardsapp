import { AnimatePresence, motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { boardAtom, visiblePendingSelector } from "../state/atoms";
import { Card } from "./Card";

const HEADINGS = { pending: "To do", done: "Done" };
const EDGES = { pending: "border-r", done: "border-l" };

function EmptyColumn() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 300 }}
        exit={{ width: 0 }}
        className="absolute mb-[50px] flex h-52 items-center justify-center rounded-xl bg-blue-300">
        No more cards
      </motion.div>
    </AnimatePresence>
  );
}

export function CardColumn({ column }) {
  const { done } = useRecoilValue(boardAtom);
  const pending = useRecoilValue(visiblePendingSelector);
  const cards = column === "pending" ? pending : done;

  return (
    <section
      style={{ flex: "0.45" }}
      className={`flex h-screen flex-col items-center justify-center border-gray-400 ${EDGES[column]}`}>
      <h2 className="-mt-[600px] text-xl font-bold text-black">{HEADINGS[column]}</h2>
      {cards.length === 0 ? (
        <EmptyColumn />
      ) : (
        cards.map(card => <Card key={card.id} column={column} {...card} />)
      )}
    </section>
  );
}
