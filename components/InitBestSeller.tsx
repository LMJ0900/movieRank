'use client'

import { useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { bestSellerState } from "@/recoil/bookState";
import { BookItem } from "@/types/type";

function isBookListEqual(a: BookItem[] | unknown, b: BookItem[] | unknown): boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;

  return a.every((book, i) => book.isbn === b[i]?.isbn);
}

export default function InitBestSeller({ bookList } : {bookList : BookItem[]}) {
  const setBestSellers = useSetRecoilState(bestSellerState);
  const currentBestSellers = useRecoilValue(bestSellerState);

  useEffect(() => {
    console.log("✅ InitBestSeller 실행됨");
    console.log("📚 서버 bookList:", bookList);
    console.log("📚 Recoil currentBestSellers:", currentBestSellers);

    // ✅ 상태가 다를 경우에만 Recoil 업데이트
    if (!isBookListEqual(currentBestSellers, bookList)) {
      console.log("📚 베스트셀러 상태 업데이트");
      setBestSellers([...bookList]);
    }
  }, [bookList, currentBestSellers]);

  return null;
}
