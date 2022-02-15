import { atom, selector } from "recoil";
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

export const searchAtom = atom({
  key: "searchText",
  default: "",
});

export const filteredTodos = selector({
  key: "filteredtodos",
  get: ({ get }) => {
    const data = get(todosAtom);
    const searchText = get(searchAtom);
    const done = get(doneAtom);
    return data.filter(
      ({ patient_name, arrhythmias, status }) =>
        (patient_name.toLowerCase().includes(searchText.toLowerCase()) ||
          arrhythmias.some(el => el.toLowerCase().includes(searchText.toLowerCase()))) &&
        !done.map(el => el.patient_name).includes(patient_name) &&
        status !== "DONE"
    );
  },
});
