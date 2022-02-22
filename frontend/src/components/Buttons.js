import { Button } from "@mui/material";
import ArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import ArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useRecoilValue } from "recoil";
import { boardAtom, visiblePendingSelector } from "../state/atoms";
import { useSwipes } from "../state/useSwipes";

// Cards are stacked absolutely, so the last one rendered is the one on top.
const topCardId = cards => cards[cards.length - 1]?.id;

/** Keyboard/pointer equivalents of the two gestures, driving the same transitions. */
export function Buttons() {
  const { done } = useRecoilValue(boardAtom);
  const pending = useRecoilValue(visiblePendingSelector);
  const completeTop = useSwipes(topCardId(pending));
  const reopenTop = useSwipes(topCardId(done));

  return (
    <div style={{ flex: "0.1" }} className="flex h-screen flex-col items-center justify-center">
      <div className="flex h-[20%] w-full flex-col items-center justify-around">
        <Button variant="contained" disabled={!pending.length} endIcon={<ArrowRight />} onClick={() => completeTop("right")}>
          Complete
        </Button>
        <Button variant="outlined" disabled={!done.length} startIcon={<ArrowLeft />} onClick={() => reopenTop("left")}>
          Reopen
        </Button>
      </div>
    </div>
  );
}
