// recoil/bookState.js
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();


export const bestSellerState = atom({
  key: "bestSellerState",
  default: [], // 기본은 빈 배열
  effects_UNSTABLE: [persistAtom],
});
