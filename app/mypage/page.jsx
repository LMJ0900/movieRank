"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/data";
import { useLoginCheck } from "@/hooks/Auth";
import { checkNickname } from "@/components/checkNickname"
export default function MyPage() {
    const { user, loading } = useLoginCheck();
    const [nickname, setNickname] = useState("");
    const [newNickname, setNewNickname] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!user) return; 
    
        (async () => { 
            await fetchNickname();
        })();
    }, [user]);

    // ✅ 현재 닉네임 가져오기
    const fetchNickname = async () => {
        if (!user?.id) return;
        const { data, error } = await supabase
            .from("profiles")
            .select("nickname")
            .eq("id", user.id)
            .single();

        if (error) {
            console.error("닉네임 불러오기 오류:", error);
        } else {
            setNickname(data.nickname);
            setNewNickname(data.nickname);
        }
    };


    // ✅ 닉네임 변경
    const handleUpdateNickname = async () => {
        if (!newNickname.trim()) {
            alert("닉네임을 입력하세요.");
            return;
        }

        if (newNickname === nickname) {
            alert("기존 닉네임과 동일합니다.");
            return;
        }

        setUpdateLoading(true);

        // ✅ 닉네임 중복 체크
        const isNicknameTaken = await checkNickname(newNickname);
        if (isNicknameTaken) {
            setError("이미 사용 중인 닉네임입니다.");
            setUpdateLoading(false);
            return;
        }

        const { error } = await supabase
            .from("profiles")
            .update({ nickname: newNickname })
            .eq("id", user.id);

        if (error) {
            console.error("닉네임 변경 오류:", error);
        } else {
            setNickname(newNickname);
            alert("닉네임이 변경되었습니다.");
        }

        setUpdateLoading(false);
    };

    // ✅ 로그아웃 기능 추가
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("로그아웃 오류:", error);
        } else {
            router.push("/login"); // ✅ 로그아웃 후 로그인 페이지로 이동
        }
    };

    if (loading) return <h1>Loading...</h1>;
    if (!user) return <h1>로그인이 필요합니다.</h1>;

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-4">마이페이지</h1>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* ✅ 닉네임 변경 */}
            <div className="mb-4">
                <label className="block text-gray-700">닉네임</label>
                <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="mt-1 p-2 border w-full rounded"
                />
                <button
                    onClick={handleUpdateNickname}
                    disabled={updateLoading}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
                >
                    {updateLoading ? "변경 중..." : "닉네임 변경"}
                </button>
            </div>

            {/* ✅ 로그아웃 버튼 */}
            <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
            >
                로그아웃
            </button>
        </div>
    );
}
