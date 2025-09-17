"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/data";
import { checkNickname } from "@/components/checkNickname"
export default function SignupPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [nickname, setNickname] = useState<string>(""); // 닉네임 입력 필드 추가
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

         // ✅ 닉네임 중복 확인
         const isNicknameTaken = await checkNickname(nickname);
         if (isNicknameTaken) {
             setError("이미 사용 중인 닉네임입니다.");
             setLoading(false);
             return;
         }
         
        // Supabase Auth 회원가입
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        const user = data.user;

        if (user) {
            // 회원가입한 유저의 UID를 사용해 profiles 테이블에 닉네임 저장
            const { error: profileError } = await supabase.from("profiles").insert([
                { id: user.id, nickname },
            ]);

            if (profileError) {
                setError(profileError.message);
                setLoading(false);
                return;
            }

            alert("회원가입 성공! 로그인 페이지로 이동합니다.");
            router.push("/login"); // 회원가입 성공 시 로그인 페이지로 이동
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center text-black">회원가입</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <form onSubmit={handleSignup} className="flex flex-col text-black">
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded mb-2"
                        required
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 rounded mb-2"
                        required
                    />
                    <input
                        type="text"
                        placeholder="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="border p-2 rounded mb-2"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-500 text-white p-2 rounded mt-2"
                        disabled={loading}
                    >
                        {loading ? "가입 중..." : "회원가입"}
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    이미 계정이 있으신가요?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        로그인
                    </a>
                </p>
            </div>
        </div>
    );
}
