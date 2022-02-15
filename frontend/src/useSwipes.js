//hook to return swipe left and right functions
import { useSetRecoilState } from "recoil";
import { doneAtom, todosAtom } from "./atoms/dataatom";

export default function (payload) {
  const setTodos = useSetRecoilState(todosAtom);
  const setDone = useSetRecoilState(doneAtom);

  const onSwipeLeft = dir => {
    if (!payload || dir === "right") return;
    const topItem = { ...payload, status: "PENDING" };
    setDone(prevState => prevState.filter(({ id }) => id !== payload.id));
    setTodos(prevState => [...prevState, topItem]);
  };

  const onSwipeRight = dir => {
    if (!payload || dir === "left") return;
    //remove top item from todos, update the status to done and add it to done
    const topItem = { ...payload, status: "DONE" };
    setTodos(prevState => prevState.filter(({ id }) => id !== payload.id));
    setDone(prevState => [...prevState, topItem]);
  };

  return [onSwipeLeft, onSwipeRight];
}
