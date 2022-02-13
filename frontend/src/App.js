import "./App.css";
import NavBar from "./navbar";
import TodoList from "./todo";
import Buttons from "./buttons";

function App() {
  return (
    <>
      <NavBar />
      <div className="flex h-screen w-screen items-center justify-between bg-gray-200">
        <TodoList todoOrDone={"todo"} />
        <Buttons />
        <TodoList todoOrDone={"done"} />
      </div>
    </>
  );
}

export default App;
