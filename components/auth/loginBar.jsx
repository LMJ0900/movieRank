// components/ggunPr/login/login.tsx
'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/data"; // Supabase 클라이언트 import




export default function LoginBar({onSwitch }) {
  // Supabase 로그인 로직 추가
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/"); // 로그인 성공 시 이동할 경로
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className="mt-28 text-white text-[3rem]">Login</h2>
      <form onSubmit={handleLogin} className="mt-14 flex items-center flex-col gap-5">
        
        {error && <p className="text-red-400 text-sm mb-2 text-center">{error}</p>}

        <input
          className="border-b-2 bg-inherit w-[16rem] h-[3rem] text-white placeholder:text-gray-300 focus:outline-none"
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border-b-2 bg-inherit w-[16rem] h-[3rem] text-white placeholder:text-gray-300 focus:outline-none"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-8 border-white border-2 rounded-[20px] w-[7rem] h-[3rem] text-white hover:text-mainTextcolor hover:border-mainTextcolor font-semibold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
       <button
        onClick={onSwitch}
        className="md:hidden mt-8 text-sm text-gray-300 underline"
      >
        회원가입 하러가기
      </button>
    </>
  );
}