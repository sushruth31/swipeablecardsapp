import { selector, atom } from "recoil";
import { createAsset } from "use-asset";
import axios from "axios";

async function fetchData(url) {
  await new Promise(res => setTimeout(res, 1000));

  const { data } = await axios.get(url);

  return data;
}

const asset = createAsset(async url => {
  return await fetchData(url);
});

export const doneIDs = atom({
  key: "doneIDs",
  default: [2],
});

export const dataAtom = selector({
  key: "data",
  get: ({ get }) => {
    const data = asset.read("http://localhost:8080/cards");
    const doneIds = get(doneIDs);
    return data.map(el => (doneIds.some(id => id === el.id) ? { ...el, status: "DONE" } : el));
  },
});

export const doneDataAtom = selector({
  key: "doneData",
  get: ({ get }) => {
    return get(dataAtom).filter(({ status }) => status === "DONE");
  },
});
