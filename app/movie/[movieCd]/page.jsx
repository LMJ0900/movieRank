'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function MovieDetail() {
    const { movieCd } = useParams();
    const [movieDetail, setMovieDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedDetails = JSON.parse(localStorage.getItem("movieDetails")) || {};
        if (storedDetails[movieCd]) {
            setMovieDetail(storedDetails[movieCd]); // ✅ 저장된 데이터 있으면 사용
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [movieCd]);

    if (loading) return <h1>Loading...</h1>;
    if (!movieDetail) return <h1>영화 정보를 불러올 수 없습니다.</h1>;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">{movieDetail.title}</h1>
            {movieDetail.poster ? (
                <img src={movieDetail.poster} alt={movieDetail.title} className="w-80 rounded-lg" />
            ) : (
                <p>❌ 포스터 없음</p>
            )}
            <p><strong>개봉일:</strong> {movieDetail.openDt}</p>
            <p><strong>장르:</strong> {movieDetail.genre}</p>
            <p><strong>감독:</strong> {movieDetail.director}</p>
            <p><strong>줄거리:</strong> {movieDetail.plot}</p>
            <p><strong>일일 관객수:</strong> {movieDetail.audiCnt.toLocaleString()}명</p>
            <p><strong>누적 관객수:</strong> {movieDetail.audiAcc.toLocaleString()}명</p>
        </div>
    );
}
