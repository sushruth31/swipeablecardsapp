import { useRecoilState } from "recoil";
import Card from "./card";
import { asset, todosAtom, doneAtom } from "./atoms/dataatom";
import { useEffect } from "react";

export default function ({ todoOrDone }) {
  const fetchedData = asset.read("http://localhost:8080/cards");
  const [todos, setTodosData] = useRecoilState(todosAtom);
  const [done, setDoneData] = useRecoilState(doneAtom);
  const dataToMap = todoOrDone === "todo" ? todos : done;

  const className1 = `flex  h-screen flex-col items-center justify-center border-r border-gray-400`;

  const className2 = `flex  h-screen flex-col items-center justify-center border-l border-gray-400`;

  useEffect(() => {
    setTodosData(fetchedData.filter(({ status }) => status !== "DONE"));
    setDoneData(fetchedData.filter(({ status }) => status === "DONE"));
  }, []);

  return (
    <div style={{ flex: "0.45" }} className={todoOrDone === "todo" ? className1 : className2}>
      <div className="-mt-[600px] text-xl font-bold text-black">{todoOrDone === "todo" ? "To Do" : "Done"}</div>
      {dataToMap.map((obj, i) => (
        <Card
          isTopCard={todoOrDone === "todo" ? i === todos.length - 1 : i === done.length - 1}
          todoOrDone={todoOrDone}
          key={obj.id}
          {...obj}
        />
      ))}
    </div>
  );
}
