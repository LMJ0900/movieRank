import { MovieInfoType, PosterMap } from "@/types/type";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const boxOfficeState = atom<MovieInfoType[]>({
  key: "boxOfficeState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const moviePosterState = atom<PosterMap>({
  key: "moviePosterState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});