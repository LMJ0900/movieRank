'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/data';
import { useLoginCheck } from '@/hooks/Auth';
import { useRecoilValue } from 'recoil';
import { boxOfficeState, moviePosterState } from '@/recoil/movieState';

export default function MovieDetail() {
  const { movieCd } = useParams();
  const router = useRouter();

  const [movieDetail, setMovieDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const { user, loading: authLoading } = useLoginCheck();
  const movieList = useRecoilValue(boxOfficeState);
  const posterData = useRecoilValue(moviePosterState);

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

  useEffect(() => {
    if (!movieCd) return;
    let cancelled = false;
    (async () => {
      setLoadingComments(true);
      const { data, error } = await supabase
        .from('comments')
        .select('id, user_id, content, created_at, profiles(nickname)')
        .eq('movie_id', movieCd)
        .order('created_at', { ascending: false });
      if (!cancelled) {
        if (error) {
          console.error('댓글 로드 오류:', error);
          setComments([]);
        } else {
          setComments(data || []);
        }
        setLoadingComments(false);
      }
    })();
    return () => { cancelled = true; };
  }, [movieCd]);

  useEffect(() => {
    (async () => {
      if (comments.length === 0) {
        setLikeCounts({});
        setLikedComments({});
        return;
      }
      const ids = comments.map(c => c.id);
      const { data, error } = await supabase
        .from('likes')
        .select('comment_id, user_id')
        .in('comment_id', ids);
      if (error) {
        console.error('❌ 좋아요 로딩 실패:', error);
        return;
      }
      const counts = {};
      const likedByUser = {};
      for (const id of ids) {
        const liked = data.filter(l => l.comment_id === id);
        counts[id] = liked.length;
        if (user) likedByUser[id] = liked.some(l => l.user_id === user.id);
      }
      setLikeCounts(counts);        // 누구나 볼 수 있음
      if (user) setLikedComments(likedByUser); // 유저 준비되면 내 좋아요 반영
    })();
  }, [comments, user]);

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
        profiles: { nickname: userProfile.data?.nickname }
      };

      setComments([newCommentData, ...comments]);
      setNewComment("");
    } else {
      console.error("댓글 추가 오류:", error);
    }
  };

  const handleToggleLike = async (commentId) => {
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
          {loadingComments ? (
            <p className="text-gray-500">댓글 불러오는 중…</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500">아직 작성된 댓글이 없습니다.</p>
          ) : (
            comments.map((comment) => (
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
