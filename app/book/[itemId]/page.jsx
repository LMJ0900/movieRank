'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/data';
import { usebookData } from '@/hooks/bookHook';
import { fetchBestsellerData } from "@/actions/bookAction"
import { useLoginCheck } from '@/hooks/Auth';  // ✅ 로그인 체크 훅 사용

export default function bookDetail(){
    const { itemId } = useParams();
    const router = useRouter();
    const bookApikey = "ttbalswodnjswo1609001";

    const [bookDetail, setBookDetail] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);

    const { bookList, loading : bookLoading} = usebookData(bookApikey)
    const { user, loading: authLoading } = useLoginCheck();

    useEffect(() => {
        if (bookList.length > 0) {
            fetchBookDetails();
        }
    }, [itemId, bookList]);

    const fetchBookDetails = async () => {
        try {
            setLoading(true);

            // ✅ API에서 도서 상세 정보 가져오기
            const bookList = await fetchBestsellerData(bookApikey);

            if (!bookList || bookList.length === 0) throw new Error("도서 목록이 비어 있음");
            
             // ✅ 현재 itemId에 해당하는 책 찾기
             const bookData = bookList.find(book => book.itemId === itemId);

            if (!bookData) throw new Error("도서 정보 없음");

            setBookDetail(bookData);

            // ✅ Supabase에서 댓글 가져오기
            const { data: commentsData, error: commentsError } = await supabase
                .from("book_comments")
                .select("id, user_id, content, created_at, profiles(nickname)")
                .eq("book_id", itemId)
                .order("created_at", { ascending: false });

            if (commentsError) {
                console.error("🚨 댓글 불러오기 오류:", commentsError);
            } else {
                setComments(commentsData || []);
            }
        } catch (error) {
            console.error("🚨 데이터 로드 오류:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ 댓글 추가 기능
    const handleAddComment = async () => {
        if (!user) {
            alert("로그인이 필요한 서비스입니다.");
            router.push('/login');
            return;
        }

        if (newComment.trim() === "") return;

        const { data, error } = await supabase
            .from("book_comments")
            .insert([{ book_id: itemId, user_id: user.id, content: newComment }])
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

    // ✅ 로딩 중 화면
    if (loading || authLoading) return <h1>Loading...</h1>;
    if (!bookDetail) return <h1>도서 정보를 불러올 수 없습니다.</h1>;


    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">{bookDetail.title}</h1>
            {bookDetail.cover ? (
                <img src={bookDetail.cover} alt={bookDetail.title} className="w-80 rounded-lg" />
            ) : (
                <p>❌ 표지 이미지 없음</p>
            )}
            <p><strong>저자:</strong> {bookDetail.author}</p>
            <p><strong>출판사:</strong> {bookDetail.publisher}</p>
            <p><strong>출판일:</strong> {bookDetail.pubDate}</p>
            <p><strong>itemId:</strong> {bookDetail.itemId}</p>
            <p><strong>설명:</strong> {bookDetail.description || "설명 없음"}</p>

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

                {/* ✅ 댓글 리스트 */}
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