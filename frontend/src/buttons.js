import { Button } from "@mui/material";
import { useRecoilValue } from "recoil";
import { doneAtom, todosAtom } from "./atoms/dataatom";
import useSwipes from "./useSwipes";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function () {
  const todos = useRecoilValue(todosAtom);
  const done = useRecoilValue(doneAtom);
  const todosCopy = [...todos];
  const doneCopy = [...done];
  const [_, onSwipeRight] = useSwipes(todosCopy.pop());
  const [onSwipeLeft, __] = useSwipes(doneCopy.pop());

  return (
    <div style={{ flex: "0.1" }} className="flex h-screen flex-col items-center justify-center">
      <div className="flex h-[20%] w-[100%] flex-col items-center justify-around">
        <Button onClick={onSwipeRight} variant="contained">
          Add
          {<KeyboardArrowRightIcon />}
        </Button>
        <Button onClick={onSwipeLeft} variant="outlined">
          {<KeyboardArrowLeftIcon />}
          Remove
        </Button>
      </div>
    </div>
  );
}
