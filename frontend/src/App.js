import { Buttons } from "./components/Buttons";
import { CardColumn } from "./components/CardColumn";
import { NavBar } from "./components/NavBar";
import { useBoardData } from "./state/useBoardData";

export function App() {
  useBoardData();

  return (
    <>
      <NavBar />
      <main className="flex h-screen w-screen items-center justify-between bg-gray-200">
        <CardColumn column="pending" />
        <Buttons />
        <CardColumn column="done" />
      </main>
    </>
  );
}
