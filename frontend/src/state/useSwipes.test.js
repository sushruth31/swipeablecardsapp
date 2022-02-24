import { fireEvent, render, screen } from "@testing-library/react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { Buttons } from "../components/Buttons";
import { boardAtom } from "./atoms";

const card = (id, status = "PENDING") => ({
  id,
  title: `Card ${id}`,
  tags: ["infra"],
  createdAt: "2022-02-10T09:00:00Z",
  status,
});

/** Renders the live board so assertions read column membership, not DOM chrome. */
function BoardProbe() {
  const { pending, done } = useRecoilValue(boardAtom);
  return <div data-testid="board">{`${pending.map(c => c.id)} / ${done.map(c => c.id)}`}</div>;
}

const renderBoard = board =>
  render(
    <RecoilRoot initializeState={({ set }) => set(boardAtom, board)}>
      <Buttons />
      <BoardProbe />
    </RecoilRoot>
  );

const click = name => fireEvent.click(screen.getByRole("button", { name }));

describe("board controls", () => {
  it("completes the top pending card, which is the last one rendered in the stack", () => {
    renderBoard({ pending: [card(1), card(2)], done: [] });
    click(/complete/i);
    expect(screen.getByTestId("board")).toHaveTextContent("1 / 2");
  });

  it("reopens the top done card back into the pending column", () => {
    renderBoard({ pending: [card(1)], done: [card(9, "DONE")] });
    click(/reopen/i);
    expect(screen.getByTestId("board")).toHaveTextContent("1,9 /");
  });

  it("disables each control when its column is empty so no swipe fires on nothing", () => {
    renderBoard({ pending: [], done: [] });
    expect(screen.getByRole("button", { name: /complete/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /reopen/i })).toBeDisabled();
  });
});
