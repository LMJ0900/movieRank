import { useEffect, useState } from "react";
import { fetchBoxOfficeData } from "@/actions/movieAction";
import { fetchMoviePosters } from "@/actions/movieAction";
import { MovieInfoType, PosterMap } from "@/types/type";
// ✅ 커스텀 훅: 박스오피스 데이터 가져오기
export const useBoxOfficeData = (dateType:string, apiKey:string) => {
    const [movieList, setMovieList] = useState<MovieInfoType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getBoxOfficeData = async () => {
            const data = await fetchBoxOfficeData(dateType, apiKey);
            setMovieList(data as MovieInfoType[]);
            setLoading(false);
        };
        getBoxOfficeData();
    }, [dateType, apiKey]);

    return { movieList, loading };
};

// ✅ 커스텀 훅: 영화 포스터 가져오기
export const useMoviePosters = (movieList:MovieInfoType[], apiKey2:string) => {
    const [moviePosters, setMoviePosters] = useState<PosterMap>({});

    useEffect(() => {
        const getMoviePosters = async () => {
            const postersData = await fetchMoviePosters(movieList, apiKey2);
            setMoviePosters((prev) => ({ ...prev, ...(postersData as PosterMap) }));
        };

        if (movieList.length > 0) {
            getMoviePosters();
        }
    }, [movieList, apiKey2]);

    return { moviePosters };
};
