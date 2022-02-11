import { atom } from "recoil";

export const searchAtom = atom({
  key: "searchText",
  default: "",
});
