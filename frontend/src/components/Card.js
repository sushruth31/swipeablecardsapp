import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import TinderCard from "react-tinder-card";
import { relativeTime } from "../lib/time";
import { searchAtom } from "../state/atoms";
import { useSwipes } from "../state/useSwipes";

// A card may only travel towards the column it does not already belong to.
// Vertical swipes are blocked outright so a card can never fly off screen
// without a corresponding board transition behind it.
const LOCKED_DIRECTIONS = {
  pending: ["left", "up", "down"],
  done: ["right", "up", "down"],
};

// Module-scope constants: a variants object rebuilt per render would restart
// the animation, and a component declared per render would remount the subtree.
const REVEAL = { initial: { width: 0 }, animate: { width: 300 }, exit: { width: 0 } };
const FADE = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
const TAG_ANIMATION = {
  hidden: { opacity: 0, y: -50 },
  visible: index => ({ opacity: 1, y: 0, transition: { delay: index * 0.05 } }),
};

const CARD_STYLE = "absolute mb-[50px] flex h-80 w-80 items-center justify-center rounded-xl bg-white shadow-md";
const TOGGLE_STYLE = "absolute right-2 top-2 text-sm text-blue-600";

function TagList({ tags }) {
  return (
    <ul>
      {tags.map((tag, index) => (
        <motion.li
          key={tag}
          custom={index}
          variants={TAG_ANIMATION}
          initial="hidden"
          animate="visible"
          className="list-none">
          {tag}
        </motion.li>
      ))}
    </ul>
  );
}

function CardDetails({ tags, createdAt }) {
  return (
    <motion.div {...REVEAL} className="mt-4 flex h-64 w-full flex-col p-2">
      <div className="text-sm text-gray-500">{`Created ${relativeTime(createdAt)}`}</div>
      <div className="mb-2 mt-3 font-bold">Tags</div>
      <TagList tags={tags} />
    </motion.div>
  );
}

function CardSummary({ title, status }) {
  return (
    <motion.div {...FADE} className="flex flex-col px-6">
      <div className="mb-3 text-center font-medium">{title}</div>
      <div className="text-center text-sm uppercase tracking-wide text-gray-500">{status}</div>
    </motion.div>
  );
}

export function Card({ id, title, tags, createdAt, status, column }) {
  const [showDetails, setShowDetails] = useState(false);
  const swipe = useSwipes(id);
  const searchText = useRecoilValue(searchAtom);
  // Collapse on search so the stack stays uniform while results shuffle underneath.
  useEffect(() => setShowDetails(shown => shown && !searchText), [searchText]);

  return (
    <TinderCard preventSwipe={LOCKED_DIRECTIONS[column]} onSwipe={swipe} className={CARD_STYLE}>
      <button type="button" onClick={() => setShowDetails(shown => !shown)} className={TOGGLE_STYLE}>
        {showDetails ? "Hide details" : "View details"}
      </button>
      <AnimatePresence initial={false}>
        {showDetails
          ? <CardDetails key="details" tags={tags} createdAt={createdAt} />
          : <CardSummary key="summary" title={title} status={status} />}
      </AnimatePresence>
    </TinderCard>
  );
}
