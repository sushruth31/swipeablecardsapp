import { selector } from "recoil";
import { createAsset } from "use-asset";
import axios from "axios";

function fetchData(url) {
  return new Promise(res => {
    setTimeout(() => {
      res(axios.get(url).then(resp => resp.data));
    }, 1000);
  });
}

const asset = createAsset(async url => {
  return await fetchData(url);
});

export const dataAtom = selector({
  key: "textState",
  get: () => asset.read("http://localhost:8080/cards"),
});
