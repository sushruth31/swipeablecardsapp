import { useRecoilState } from "recoil";
import { dataAtom } from "./atoms/dataatom";
import { doneDataAtom } from "./atoms/dataatom";
import Card from "./card";

export default function ({ todoOrDone }) {
  const [data, setData] = useRecoilState(todoOrDone === "todo" ? dataAtom : doneDataAtom);

  return (
    <div
      style={{ flex: "0.45" }}
      className={`flex  h-screen flex-col items-center justify-center border-${
        todoOrDone === "todo" ? "r" : "l"
      } border-gray-400`}>
      <div className="-mt-[600px] text-xl font-bold text-black">{todoOrDone === "todo" ? "To Do" : "Done"}</div>
      {data.map(obj => (
        <Card todoOrDone={todoOrDone} key={obj.id} {...obj} />
      ))}
    </div>
  );
}
