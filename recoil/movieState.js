import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const boxOfficeState = atom({
  key: "boxOfficeState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const moviePosterState = atom({
  key: "moviePosterState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});