import { Button } from "@mui/material";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { topCardRefTodosAtom, topCardRefDoneAtom } from "./atoms/cardrefatom";

export default function () {
  const topcardreftodo = useRecoilValue(topCardRefTodosAtom);
  const topcardrefdone = useRecoilValue(topCardRefDoneAtom);

  useEffect(() => console.log(topcardreftodo), [topcardreftodo]);

  return (
    <div style={{ flex: "0.1" }} className="flex h-screen flex-col items-center justify-center">
      <div className="flex h-[20%] w-[100%] flex-col items-center justify-around">
        <Button onClick={() => topcardreftodo.swipe("right")} variant="contained">
          Add
        </Button>
        <Button onClick={() => topcardrefdone.swipe("left")} variant="outlined">
          Remove
        </Button>
      </div>
    </div>
  );
}
