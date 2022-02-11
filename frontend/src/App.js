import "./App.css";
import { useRecoilState } from "recoil";
import { dataAtom } from "./atoms/dataatom";
import NavBar from "./navbar";
import TodoList from "./todo";
import DoneList from "./donelist";
import Buttons from "./buttons";

function App() {
  const [data, setData] = useRecoilState(dataAtom);

  return (
    <>
      <NavBar />
      <div className="flex h-screen w-screen items-center justify-between">
        <TodoList />
        <Buttons />
        <DoneList />
      </div>
    </>
  );
}

export default App;
