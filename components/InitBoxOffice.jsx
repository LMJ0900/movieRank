// components/InitBoxOffice.jsx
'use client';

import { useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { boxOfficeState, moviePosterState } from "@/recoil/movieState";

export default function InitBoxOffice({ movieList, moviePosters }) {
  const setBoxOffice = useSetRecoilState(boxOfficeState);
  const setMoviePosters = useSetRecoilState(moviePosterState);

  const currentBoxOffice = useRecoilValue(boxOfficeState);
  const currentPosters = useRecoilValue(moviePosterState);

  useEffect(() => {
    console.log("✅ InitBoxOffice 실행됨");

    // BoxOffice 상태가 비어 있을 때만 설정
    if (currentBoxOffice.length === 0 && movieList?.length > 0) {
      console.log("🎬 boxOffice 상태 설정");
      setBoxOffice([...movieList]);
    }

    // 포스터 상태가 비어 있을 때만 설정
    if (
      Object.keys(currentPosters).length === 0 &&
      moviePosters &&
      Object.keys(moviePosters).length > 0
    ) {
      console.log("🖼️ 포스터 상태 설정");
      setMoviePosters({ ...moviePosters });
    }
  }, [movieList, moviePosters, currentBoxOffice, currentPosters]);

  return null;
}
