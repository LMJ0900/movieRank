'use client'

import { useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { bestSellerState } from "@/recoil/bookState";

export default function InitBestSeller({ bookList }) {
  const setBestSellers = useSetRecoilState(bestSellerState);

  const currentBestSellers = useRecoilValue(bestSellerState);
  console.log("bookList ✅", bookList);
  console.log("currentBestSellers 🧪", currentBestSellers);
   useEffect(() => {
    console.log("✅ Initbestseller 실행됨");

    if (currentBestSellers.length === 0 && bookList?.length > 0) {
      setBestSellers([...bookList]);
    }
  }, [bookList, currentBestSellers]);

  return null;
}
