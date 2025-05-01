import { useEffect, useState } from "react";
import { fetchBoxOfficeData } from "@/actions/movieAction";
import { fetchMoviePosters } from "@/actions/movieAction";
// ✅ 커스텀 훅: 박스오피스 데이터 가져오기
export const useBoxOfficeData = (dateType, apiKey) => {
    const [movieList, setMovieList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBoxOfficeData = async () => {
            const data = await fetchBoxOfficeData(dateType, apiKey);
            setMovieList(data);
            setLoading(false);
        };
        getBoxOfficeData();
    }, [dateType, apiKey]);

    return { movieList, loading };
};

// ✅ 커스텀 훅: 영화 포스터 가져오기
export const useMoviePosters = (movieList, apiKey2) => {
    const [moviePosters, setMoviePosters] = useState({});

    useEffect(() => {
        const getMoviePosters = async () => {
            const postersData = await fetchMoviePosters(movieList, apiKey2);
            setMoviePosters((prev) => ({ ...prev, ...postersData }));
        };

        if (movieList.length > 0) {
            getMoviePosters();
        }
    }, [movieList, apiKey2]);

    return { moviePosters };
};
