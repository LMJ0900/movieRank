'use client';

import { useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { boxOfficeState, moviePosterState } from "@/recoil/movieState";
import { BoxOfficeListType, PosterMap } from "@/types/type";

function isMovieListEqual(a: ReadonlyArray<{ movieCd: string | number }>,
  b: ReadonlyArray<{ movieCd: string | number }>):boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;

  return a.every((movie, i) => movie.movieCd === b[i]?.movieCd);
}

function isPosterMapEqual(a: PosterMap, b: PosterMap) {
  if (!a || !b) return false;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every((key) => a[key] === b[key]);
}

export default function InitBoxOffice({ movieList, moviePosters } : BoxOfficeListType) {
  const setBoxOffice = useSetRecoilState(boxOfficeState);
  const setMoviePosters = useSetRecoilState(moviePosterState);

  const currentBoxOffice = useRecoilValue(boxOfficeState);
  const currentPosters = useRecoilValue(moviePosterState);

  useEffect(() => {
    console.log("✅ InitBoxOffice 실행됨");

    // 🎬 영화 리스트 비교 후 변경 시에만 업데이트
    if (!isMovieListEqual(currentBoxOffice, movieList)) {
      console.log("🎬 boxOffice 상태 업데이트");
      setBoxOffice([...movieList]);
    }

    // 🖼️ 포스터 맵 비교 후 변경 시에만 업데이트
    if (!isPosterMapEqual(currentPosters, moviePosters)) {
      console.log("🖼️ 포스터 상태 업데이트");
      setMoviePosters({ ...moviePosters });
    }
  }, [movieList, moviePosters, currentBoxOffice, currentPosters]);

  return null;
}