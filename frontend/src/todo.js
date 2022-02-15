import { useRecoilState, useRecoilValue } from "recoil";
import Card from "./card";
import { asset, todosAtom, doneAtom } from "./atoms/dataatom";
import { searchAtom } from "./atoms/searchatom";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ({ todoOrDone }) {
  const fetchedData = asset.read("http://localhost:8080/cards");
  const [todos, setTodosData] = useRecoilState(todosAtom);
  const [done, setDoneData] = useRecoilState(doneAtom);
  const dataToMap = todoOrDone === "todo" ? todos : done;
  const searchText = useRecoilValue(searchAtom);
  const className1 = `flex  h-screen flex-col items-center justify-center border-r border-gray-400`;
  const className2 = `flex  h-screen flex-col items-center justify-center border-l border-gray-400`;

  useEffect(() => {
    setTodosData(fetchedData.filter(({ status }) => status !== "DONE"));
    setDoneData(fetchedData.filter(({ status }) => status === "DONE"));
  }, []);

  //search function

  useEffect(() => {
    //filter out the ones in the done list also

    setTodosData(
      fetchedData.filter(
        ({ patient_name }) =>
          patient_name.toLowerCase().includes(searchText.toLowerCase()) &&
          !done.map(el => el.patient_name).includes(patient_name)
      )
    );
  }, [searchText]);

  return (
    <div style={{ flex: "0.45" }} className={todoOrDone === "todo" ? className1 : className2}>
      <div className="-mt-[600px] text-xl font-bold text-black">{todoOrDone === "todo" ? "To Do" : "Done"}</div>
      {dataToMap.length > 0 ? (
        dataToMap.map((obj, i) => {
          return <Card topCard todoOrDone={todoOrDone} key={obj.id} {...obj} />;
        })
      ) : (
        <AnimatePresence>
          <motion.div
            key={"nomorecards"}
            initial={{ width: 0 }}
            animate={{ width: 300 }}
            exit={{ width: 0 }}
            className="absolute mb-[50px] flex h-52 items-center justify-center rounded-xl bg-blue-300">
            No More Cards
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
