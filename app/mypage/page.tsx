"use client";
import { LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/data";
import { useLoginCheck } from "@/hooks/Auth";
import { checkNickname } from "@/components/checkNickname"
export default function MyPage() {
    const { user, loading } = useLoginCheck();
    const [nickname, setNickname] = useState<string>("");
    const [newNickname, setNewNickname] = useState<string>("");
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
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
        if (!user?.id) {
            alert("로그인이 필요합니다.");
            router.push("/login");
            return;
        }

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
        <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-2xl mt-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">마이페이지</h1>
                <button
                    onClick={() => router.back()}
                     className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                    <LogOut size={30} />
                </button>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">현재 닉네임</label>
                <div className="text-gray-800 font-semibold mb-2">{nickname}</div>

                <label className="block text-sm font-medium text-gray-600 mb-1">새 닉네임</label>
                <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="새 닉네임을 입력하세요"
                />
                <button
                    onClick={handleUpdateNickname}
                    disabled={updateLoading}
                    className="mt-3 w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
                >
                    {updateLoading ? "변경 중..." : "닉네임 변경"}
                </button>
            </div>

            <hr className="my-6 border-gray-200" />

            <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition"
            >
                로그아웃
            </button>
        </div>
    );
}
