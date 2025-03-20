'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/data';
import { useBoxOfficeData } from '@/hooks/movieHook';
import { fetchMoviePosters } from '@/actions/movieAction';
import { useLoginCheck } from '@/hooks/Auth';  // ✅ 로그인 체크 훅 사용
import { dateType } from '../../../components/dateType';
export default function MovieDetail() {
    const { movieCd } = useParams();
    const router = useRouter();
    const apiKey = process.env.NEXT_PUBLIC_BOXOFFICE_API_KEY;
    const apiKey2 = process.env.NEXT_PUBLIC_MOVIEPOSTER_API_KEY;

    const [movieDetail, setMovieDetail] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true); // ✅ 해결: loading 상태 추가


    // ✅ useBoxOfficeData()를 활용해 영화 목록 가져오기
    const { movieList, loading: boxOfficeLoading } = useBoxOfficeData(dateType, apiKey);
    const { user, loading: authLoading } = useLoginCheck(); // ✅ 로그인 체크

    // ✅ 3. 영화 정보 가져오기 (공공 API 중복 요청 방지)
    useEffect(() => {
        if (movieList.length > 0) {
            fetchMovieDetails();
        }
    }, [movieCd, movieList]);

    const fetchMovieDetails = async () => {
        try {
            setLoading(true);

            const movie = movieList.find((m) => m.movieCd === movieCd);
            if (movie) {
                const posterData = await fetchMoviePosters([movie], apiKey2);
                const posterUrl = posterData[movie.movieCd] || null;  

                setMovieDetail({
                    title: movie.movieNm,
                    genre: movie.genreAlt || "장르 정보 없음",
                    director: movie.directors?.[0]?.peopleNm || "감독 정보 없음",
                    plot: "줄거리 정보 없음",
                    audiAcc: movie.audiAcc || 0,
                    poster: posterUrl
                });
            } else {
                throw new Error("영화 정보 없음");
            }

            // ✅ Supabase에서 모든 댓글 가져오기 (리렌더링 시에도 유지)
            const { data: commentsData, error: commentsError } = await supabase
                .from("comments")
                .select("id, user_id, content, created_at, profiles(nickname)")
                .eq("movie_id", movieCd)
                .order("created_at", { ascending: false });

            if (commentsError) {
                console.error("🚨 댓글 불러오기 오류:", commentsError);
            } else {
                setComments(commentsData || []); // ✅ 데이터 없을 경우 빈 배열 유지
            }
        } catch (error) {
            console.error("🚨 데이터 로드 오류:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ 4. 댓글 추가 기능
    const handleAddComment = async () => {
        if (!user) {
            alert("로그인이 필요한 서비스입니다.");
            router.push('/login');
            return;
        }

        if (newComment.trim() === "") return;

        const { data, error } = await supabase
        .from("comments")
        .insert([{ movie_id: movieCd, user_id: user.id, content: newComment }])
        .select("id, user_id, content, created_at");

        if (!error) {
            const userProfile = await supabase
                .from("profiles")
                .select("nickname")
                .eq("id", user.id)
                .single();
            const newCommentData = {
                ...data[0],
                profiles: { nickname: userProfile.data?.nickname}
                };
                setComments([newCommentData, ...comments]);
                setNewComment("");
        } else {
            console.error("댓글 추가 오류:", error);
        }
    };

    // ✅ 로딩 중 화면
    if (loading || boxOfficeLoading || authLoading) return <h1>Loading...</h1>;
    if (!movieDetail) return <h1>영화 정보를 불러올 수 없습니다.</h1>;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">{movieDetail.title}</h1>
            {movieDetail.poster ? (
                <img src={movieDetail.poster} alt={movieDetail.title} className="w-80 rounded-lg" />
            ) : (
                <p>❌ 포스터 없음</p>
            )}
            <p><strong>장르:</strong> {movieDetail.genre}</p>
            <p><strong>감독:</strong> {movieDetail.director}</p>
            <p><strong>줄거리:</strong> {movieDetail.plot}</p>
            <p><strong>누적 관객수:</strong> {movieDetail.audiAcc.toLocaleString()}명</p>

            {/* ✅ 댓글 섹션 */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">댓글</h2>
                <textarea
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="댓글을 입력하세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onMouseDown={() => {
                        if (!user) {
                            alert("로그인이 필요한 서비스입니다.");
                            router.push('/login');
                        }
                    }}
                />
                <button
                    onClick={handleAddComment}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    댓글 작성
                </button>

                {/* ✅ 댓글 리스트 (닉네임 포함) */}
                <div className="mt-4">
                    {comments.length === 0 ? (
                        <p className="text-gray-500">아직 작성된 댓글이 없습니다.</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="p-2 border-b">
                                <p className="text-sm text-gray-600">
                                    <strong>{comment.profiles?.nickname || "익명"}</strong> - {new Date(comment.created_at).toLocaleString()}
                                </p>
                                <p>{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
