import { useEffect, useRef, useState } from "react";
import TinderCard from "react-tinder-card";
import { ListItemButton, ListItemText } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import { useRecoilState } from "recoil";
import { doneAtom, todosAtom } from "./atoms/dataatom";
import { topCardRefTodosAtom, topCardRefDoneAtom } from "./atoms/cardrefatom";

export default function ({ patient_name, arrhythmias, created_date, todoOrDone, id, isTopCard }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [todos, setTodos] = useRecoilState(todosAtom);
  const [done, setDone] = useRecoilState(doneAtom);
  const topCardRefTodo = useRef();
  const topCardRefDone = useRef();
  const [_, setTopCardRefTodo] = useRecoilState(topCardRefTodosAtom);
  const [__, setTopCardRefDone] = useRecoilState(topCardRefDoneAtom);

  useEffect(() => {
    setTopCardRefTodo(topCardRefTodo.current);
    setTopCardRefDone(topCardRefDone.current);
  }, [isTopCard]);

  function PatientDetails() {
    return (
      <>
        <div className="flex w-[100%] flex-col p-2">
          <div className="mb-2">{`Created Date: ${moment(new Date(created_date)).fromNow()}`}</div>
          <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
            <div className="mb-2 font-bold">Arrhythmias:</div>
            {arrhythmias.map(el => (
              <ListItemButton key={el} component="a" href="#simple-list">
                <ListItemText primary={el} />
              </ListItemButton>
            ))}
          </Box>
        </div>
      </>
    );
  }

  const onSwipeLeft = dir => {
    if (dir === "right") return;
    const topItem = { patient_name, arrhythmias, created_date, id, status: "PENDING" };
    setDone(prevState => prevState.filter(({ id: previd }) => previd !== id));
    setTodos(prevState => [...prevState, topItem]);
  };

  const onSwipeRight = dir => {
    if (dir === "left") return;
    //remove top item from todos, update the status to done and add it to done
    const topItem = { patient_name, arrhythmias, created_date, id, status: "DONE" };
    setTodos(prevState => prevState.filter(({ id: previd }) => previd !== id));
    setDone(prevState => [...prevState, topItem]);
  };

  return (
    <>
      {isTopCard && todoOrDone === "todo" ? (
        <TinderCard
          ref={topCardRefTodo}
          preventSwipe={[todoOrDone === "todo" ? "left" : "right"]}
          onSwipe={todoOrDone === "todo" ? onSwipeRight : onSwipeLeft}
          className="absolute mb-[50px] flex h-80 w-80 items-center justify-center rounded-xl bg-white">
          <div onClick={() => setIsFlipped(p => !p)} className="absolute right-2 top-2 cursor-pointer">
            {isFlipped ? "Hide Details" : "View Details"}
          </div>
          {!isFlipped ? <div className="">{`Patient Name: ${patient_name}`}</div> : <PatientDetails />}
        </TinderCard>
      ) : isTopCard && todoOrDone === "done" ? (
        <TinderCard
          ref={topCardRefDone}
          preventSwipe={[todoOrDone === "todo" ? "left" : "right"]}
          onSwipe={todoOrDone === "todo" ? onSwipeRight : onSwipeLeft}
          className="absolute mb-[50px] flex h-80 w-80 items-center justify-center rounded-xl bg-white">
          <div onClick={() => setIsFlipped(p => !p)} className="absolute right-2 top-2 cursor-pointer">
            {isFlipped ? "Hide Details" : "View Details"}
          </div>
          {!isFlipped ? <div className="">{`Patient Name: ${patient_name}`}</div> : <PatientDetails />}
        </TinderCard>
      ) : (
        <TinderCard
          preventSwipe={[todoOrDone === "todo" ? "left" : "right"]}
          onSwipe={todoOrDone === "todo" ? onSwipeRight : onSwipeLeft}
          className="absolute mb-[50px] flex h-80 w-80 items-center justify-center rounded-xl bg-white">
          <div onClick={() => setIsFlipped(p => !p)} className="absolute right-2 top-2 cursor-pointer">
            {isFlipped ? "Hide Details" : "View Details"}
          </div>
          {!isFlipped ? <div className="">{`Patient Name: ${patient_name}`}</div> : <PatientDetails />}
        </TinderCard>
      )}
    </>
  );
}
