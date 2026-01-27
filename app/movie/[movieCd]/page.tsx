'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchBoxOfficeData, fetchMoviePosters } from "@/actions/movieAction";
import { supabase } from '@/lib/data';
import { useLoginCheck } from '@/hooks/Auth';
import { getDateType } from "@/components/dateType";
import { useRecoilValue,useSetRecoilState } from 'recoil';
import { boxOfficeState, moviePosterState } from '@/recoil/movieState';
import type { MovieDetailType, MovieItem, PosterMap } from '@/types/type'
import { useMutation, useQuery } from '@tanstack/react-query';
import { CommentQuery } from '@/api/Comment.query';
import { CommentMutation } from '@/api/Comment.mutation';

type AddCommentReq = {
  movieCd: string;
  userId: string;
  content: string;
};

export default function MovieDetail() {
  const { movieCd } = useParams();
  const router = useRouter();

  const [movieDetail, setMovieDetail] = useState<MovieDetailType | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [likedComments, setLikedComments] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [loadingMeta, setLoadingMeta] = useState<boolean>(true);
  const { user, loading: authLoading } = useLoginCheck();
  const movieList = useRecoilValue(boxOfficeState) as unknown as MovieItem[];
  const posterData = useRecoilValue(moviePosterState) as unknown as Record<string, string>;
  const setMovieList = useSetRecoilState(boxOfficeState);
  const setPosterData = useSetRecoilState(moviePosterState);
  const apiKey = process.env.NEXT_PUBLIC_BOXOFFICE_API_KEY;
  const apiKey2 = process.env.NEXT_PUBLIC_MOVIEPOSTER_API_KEY;
  const dateType = getDateType();
  const envReady = !!apiKey && !!apiKey2;

   const { data:AllCommentData = [], isPending:allCommentPending, isError:commentLoadError, error, refetch: refetchComments} = useQuery({
    queryKey: ['comments', movieCd],
    enabled: !!movieCd,
    queryFn: () => CommentQuery.fetchComments(movieCd as string),
    })

  const { mutate: AddCommentMutate } = useMutation({
    mutationFn: (req: AddCommentReq) => CommentMutation.addComment(req),
    onSuccess:async () => {
        await refetchComments();
        setNewComment('');
    },
    onError: (e) => {
    console.error('댓글 추가 오류:', e);
    },
  })

 
  useEffect(() => {
    if (!envReady) return;
    if (!movieCd) return;
    if (movieList.length > 0) return;
  (async () => {
    try {
      const newList = await fetchBoxOfficeData(dateType, apiKey) as unknown as MovieItem[];
      setMovieList(newList);
      const postersMap = (await fetchMoviePosters(newList, apiKey2)) as unknown as PosterMap;
      setPosterData(prev => ({ ...prev, ...postersMap }));
    } catch (e) {
      console.error('fallback 로드 오류:', e);
    }
  })();
  }, []);

   useEffect(() => {
    if (!movieCd || movieList.length === 0) return;
    setLoadingMeta(true);
    try {
      const movie = movieList.find(m => m.movieCd.toString() === movieCd.toString());
      if (!movie) throw new Error('영화 정보 없음');
      const posterUrl = posterData?.[movie.movieCd] || null;

      setMovieDetail({
        title: movie.movieNm,
        genre: movie.genreAlt || '장르 정보 없음',
        director: movie.directors?.[0]?.peopleNm || '감독 정보 없음',
        plot: '줄거리 정보 없음',
        audiAcc: movie.audiAcc || 0,
        poster: posterUrl,
      });
    } catch (e) {
      console.error(' 영화 로드 오류:', e);
      setMovieDetail(null);
    } finally {
      setLoadingMeta(false);
    }
  }, [movieCd, movieList, posterData]);

 

  if (commentLoadError) console.error('댓글 로드 오류:', error);

  useEffect(() => {
  (async () => {
    if (AllCommentData.length === 0) {
      setLikeCounts({});
      setLikedComments({});
      return;
    }
    const ids = AllCommentData.map(c => c.id);

    // 1) 전체 카운트: comment_id만 가져와서 클라이언트에서 집계 (전송량↓)
    const allLikesQuery = supabase
      .from('likes')
      .select('comment_id') // 최소 컬럼
      .in('comment_id', ids);

    // 2) 내 좋아요 여부: 현재 유저가 누른 것만 조회 (전송량↓)
    const myLikesQuery = user
      ? supabase
          .from('likes')
          .select('comment_id')
          .eq('user_id', user.id)
          .in('comment_id', ids)
      : null;

    const [allLikesRes, myLikesRes] = await Promise.all([
      allLikesQuery,
      myLikesQuery
    ]);

    // 에러 처리
    if (allLikesRes.error) {
      console.error('❌ 전체 좋아요 카운트 로딩 실패:', allLikesRes.error);
      return;
    }
    if (myLikesRes && myLikesRes.error) {
      console.error('❌ 내 좋아요 여부 로딩 실패:', myLikesRes.error);
    }

    // 1) 카운트 집계
    const counts: Record<number, number> = {};
    for (const id of ids) counts[id] = 0;
    for (const row of (allLikesRes.data ?? []) as { comment_id: number }[]) {
      counts[row.comment_id] = (counts[row.comment_id] ?? 0) + 1;
    }
    setLikeCounts(counts);

    // 2) 내 좋아요 여부
    if (user && myLikesRes?.data) {
      const likedByUser: Record<number, boolean> = {};
      for (const id of ids) likedByUser[id] = false;
      for (const row of myLikesRes.data as { comment_id: number }[]) {
        likedByUser[row.comment_id] = true;
      }
      setLikedComments(likedByUser);
    } else {
      // 유저 없으면 초기화
      setLikedComments({});
    }
  })();
}, [AllCommentData, user]);

  const handleAddComment = async () => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      router.push('/login');
      return;
    }
    if (newComment.trim() === '') return;
    const req = {movieCd: String(movieCd), userId: user.id, content: newComment}

    AddCommentMutate(req);
  };

  const handleToggleLike = async (commentId : number) => {
    if (!user) {
      alert("로그인이 필요합니다");
      router.push('/login');
      return;
    }

    const hasLiked = likedComments[commentId];

    if (hasLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("comment_id", commentId);

      setLikedComments((prev) => ({ ...prev, [commentId]: false }));
      setLikeCounts((prev) => ({ ...prev, [commentId]: (prev[commentId] || 1) - 1 }));
    } else {
      await supabase
        .from("likes")
        .insert([{ user_id: user.id, comment_id: commentId }]);

      setLikedComments((prev) => ({ ...prev, [commentId]: true }));
      setLikeCounts((prev) => ({ ...prev, [commentId]: (prev[commentId] || 0) + 1 }));
    }
  };
   if (!apiKey || !apiKey2) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        환경변수가 설정되지 않았습니다.
      </div>
    );
  }
   if (loadingMeta && !movieDetail) {
    return <h1>Loading movie…</h1>;
  }
  if (!movieDetail) {
    return <h1>영화 정보를 불러올 수 없습니다.</h1>;
  }
  
  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen bg-mainBgcolor text-maincolor">
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
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">댓글</h2>

        <textarea
          className="w-full p-3 border bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={authLoading ? '로그인 상태 확인 중…' : (user ? '댓글을 입력하세요…' : '로그인이 필요한 기능입니다.')}
          disabled={authLoading}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onClick={(e) => {
            if (!user) {
              e.preventDefault(); // focus 막기
              alert("로그인이 필요한 기능입니다.");
              router.push("/login");
            }
          }}
        />
        <button
          onClick={handleAddComment}
          className="mt-2 px-4 py-2 bg-subBgcolor  text-white rounded-md hover:bg-blue-600"
        >
          댓글 작성
        </button>

        <div className="mt-6 space-y-4">
          {allCommentPending ? (
            <p className="text-gray-500">댓글 불러오는 중…</p>
          ) : AllCommentData.length === 0 ? (
            <p className="text-gray-500">아직 작성된 댓글이 없습니다.</p>
          ) : (
            AllCommentData.map((comment) => (
              <div
                key={comment.id}
                className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-4"
              >
                <div className="absolute top-full left-6 w-0 h-0 border-t-8 border-t-white border-l-8 border-l-transparent border-r-8 border-r-transparent" />

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                      {comment.profiles?.nickname?.[0] || "익"}
                    </div>
                    <span className="font-semibold text-sm">
                      {comment.profiles?.nickname || "익명"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-800">{comment.content}</p>

                <div className="flex gap-6 mt-3 text-gray-500 text-sm">
                  <div
                    className={`flex items-center gap-1 cursor-pointer ${
                      user && likedComments[comment.id] ? "text-red-500" : "hover:text-blue-500"
                    }`}
                    onClick={() => {
                      if (!user) {
                        alert("로그인이 필요한 기능입니다.");
                        router.push("/login");
                      } else {
                        handleToggleLike(comment.id);
                      }
                    }}
                  >
                    <span>
                      {user
                        ? likedComments[comment.id]
                          ? "❤️"
                          : "🤍"
                        : "🤍"}
                    </span>
                    <span>{likeCounts[comment.id] ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
                    <span>💬</span>
                    <span>답글</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-red-400">
                    <span>🚩</span>
                    <span>신고</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}