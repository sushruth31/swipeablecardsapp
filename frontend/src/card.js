import { useState } from "react";
import TinderCard from "react-tinder-card";
import { ListItemButton, ListItemText } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import { useRecoilState } from "recoil";
import { doneIDs } from "./atoms/dataatom";

export default function ({ patient_name, arrhythmias, created_date, todoOrDone, id }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [ids, setDoneIds] = useRecoilState(doneIDs);

  function PatientDetails() {
    return (
      <>
        <div className="flex w-[100%] flex-col p-2">
          <div className="mb-2">{`Created Date: ${moment(new Date(created_date)).fromNow()}`}</div>
          <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
            <div className="mb-2 font-bold">Arrhythmias:</div>
            {arrhythmias.map(el => (
              <ListItemButton key={el} component="a" href="#simple-list">
                <ListItemText primary="Spam" />
              </ListItemButton>
            ))}
          </Box>
        </div>
      </>
    );
  }

  const onSwipeLeft = dir => {
    if (dir === "right") return;
  };

  const onSwipeRight = dir => {
    if (dir === "left") return;
    setDoneIds(prevState => [id, ...prevState]);
  };

  return (
    <TinderCard
      preventSwipe={[todoOrDone === "todo" ? "left" : "right"]}
      onSwipe={todoOrDone === "todo" ? onSwipeRight : onSwipeLeft}
      className="absolute mb-[50px] flex h-80 w-80 items-center justify-center rounded-xl bg-white">
      <div onClick={() => setIsFlipped(p => !p)} className="absolute right-2 top-2 cursor-pointer">
        {isFlipped ? "Hide Details" : "View Details"}
      </div>
      {!isFlipped ? <div className="">{`Patient Name: ${patient_name}`}</div> : <PatientDetails />}
    </TinderCard>
  );
}
