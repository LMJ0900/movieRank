'use client'

import { usePagination } from "@/hooks/pagination";
import Link from "next/link";

export default function BoxOfficeList({ movieList, moviePosters }) {
    const moviesPerPage = 5;
    const { currentPage, totalPages, currentItems, nextPage, prevPage } = usePagination(movieList.length, moviesPerPage);

    const currentMovies = currentItems(movieList);

    return (
        <div className="w-[90%] mt-20">
            <h1 className="text-3xl font-bold text-left my-6 text-mainTextcolor">박스오피스 순위</h1>
            <div className="relative w-full flex items-center">
                {/* 이전 버튼 */}
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 0} 
                    className={`absolute left-0 p-2 text-white bg-black bg-opacity-50 rounded-full ${
                        currentPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-opacity-70"
                    }`}
                >
                    ◀
                </button>

                {/* 영화 리스트 */}
                <div className="flex space-x-6 overflow-hidden w-full justify-center">
                    {currentMovies.map((movie) => (
                        <Link href={`/movie/${movie.movieCd}`} key={movie.movieCd} className="flex flex-col items-center">
                            <div className="relative">
                                <img className="w-48 h-72 rounded-lg object-cover shadow-lg" 
                                     src={moviePosters[movie.movieCd]} 
                                     alt="영화 포스터" />
                                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm">
                                    {movie.rank}
                                </div>
                            </div>
                            <h2 className="text-lg text-mainTextcolor font-semibold mt-3">{movie.movieNm}</h2>
                            <p className="text-subTextcolor">{movie.openDt} · {movie.nationAlt}</p>
                            <p className="text-sm text-subTextcolor">🎟️ 누적 관객 {Number(movie.audiAcc).toLocaleString()}명</p>
                        </Link>
                    ))}
                </div>

                {/* 다음 버튼 */}
                <button 
                    onClick={nextPage} 
                    disabled={currentPage >= totalPages - 1} 
                    className={`absolute right-0 p-2 text-white bg-black bg-opacity-50 rounded-full ${
                        currentPage >= totalPages - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-opacity-70"
                    }`}
                >
                    ▶
                </button>
            </div>
        </div>
    );
}
