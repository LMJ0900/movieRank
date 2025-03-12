"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/data";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            router.push("/"); // 로그인 성공 시 홈페이지로 이동
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center text-black">로그인</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <form onSubmit={handleLogin} className="flex flex-col text-black">
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
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded mt-2"
                        disabled={loading}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    계정이 없으신가요?{" "}
                    <a href="/signup" className="text-blue-500 hover:underline">
                        회원가입
                    </a>
                </p>
            </div>
        </div>
    );
}