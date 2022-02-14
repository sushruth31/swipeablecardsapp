import { atom } from "recoil";
import { createAsset } from "use-asset";
import axios from "axios";

async function fetchData(url) {
  await new Promise(res => setTimeout(res, 1000));

  const { data } = await axios.get(url);

  return data;
}

export const asset = createAsset(async url => {
  return await fetchData(url);
});

export const todosAtom = atom({
  key: "todos",
  default: [],
});

export const doneAtom = atom({
  key: "done",
  default: [],
});
