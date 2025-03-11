"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/data";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
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
