'use client';

import PaginatedList from "@/components/paginatedList";
import { BoxOfficeListType, MovieItem } from "@/types/type";
import Link from "next/link";

export default function BoxOfficeList({ movieList, moviePosters } : BoxOfficeListType) {
     console.log("📌 [클라이언트] movieList:", JSON.stringify(movieList, null, 2));
    return (
        <PaginatedList
            title="박스오피스 순위"
            items={movieList}
            renderItem={(movie : MovieItem) => (
                <Link href={`/movie/${movie.movieCd}`} key={movie.movieCd} className="flex flex-col items-center">
                    <div className="relative">
                        <img className="w-48 h-72 rounded-lg object-cover shadow-lg" 
                             src={moviePosters[String(movie.movieCd)]??undefined} 
                             alt="영화 포스터" />
                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm">
                            {movie.rank}
                        </div>
                    </div>
                    <h2 className="text-lg text-mainTextcolor font-semibold mt-3 w-[14rem] text-center line-clamp-2">{movie.movieNm}</h2>
                    <p className="text-subTextcolor">{movie.openDt} · {movie.nationAlt}</p>
                    <p className="text-sm text-subTextcolor">🎟️ 누적 관객 {Number(movie.audiAcc).toLocaleString()}명</p>
                </Link>
            )}
        />
    );
}
