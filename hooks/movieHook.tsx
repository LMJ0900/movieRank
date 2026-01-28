import { useEffect, useState } from "react";
import { MovieQuery } from "@/api/movie/Movie.query";
import { MovieItem, PosterMap } from "@/types/type";
// ✅ 커스텀 훅: 박스오피스 데이터 가져오기
export const useBoxOfficeData = (dateType:string, apiKey:string) => {
    const [movieList, setMovieList] = useState<MovieItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getBoxOfficeData = async () => {
            const data = await MovieQuery.getBoxOfficeList(dateType);
            setMovieList(data as MovieItem[]);
            setLoading(false);
        };
        getBoxOfficeData();
    }, [dateType, apiKey]);

    return { movieList, loading };
};

// ✅ 커스텀 훅: 영화 포스터 가져오기
export const useMoviePosters = (movieList:MovieItem[], apiKey2:string) => {
    const [moviePosters, setMoviePosters] = useState<PosterMap>({});

    useEffect(() => {
        const getMoviePosters = async () => {
            const postersData = await MovieQuery.getPostersForBoxOfficeList(movieList);
            setMoviePosters((prev) => ({ ...prev, ...(postersData as PosterMap) }));
        };

        if (movieList.length > 0) {
            getMoviePosters();
        }
    }, [movieList, apiKey2]);

    return { moviePosters };
};
