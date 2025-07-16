// components/ggunPr/join/joinBar.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/data'; // Supabase 클라이언트 import
import { checkNickname } from "@/components/checkNickname"
export default function JoinBar({ onJoinSuccess }) {
  // 회원가입 폼을 위한 State 추가
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  // 실제 회원가입 로직을 처리할 함수
  const handleSignup = async (e) => {
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
            onJoinSuccess?.();
        }

        setLoading(false);
    };

  return (
    <>
      <h2 className="mt-20 text-white text-[3rem]">Join</h2>
      <div className="mt-4 flex items-center flex-col gap-3">
        <form onSubmit={handleSignup} className="flex items-center flex-col gap-3">
          {error && <p className="text-red-400 text-sm mb-2 text-center">{error}</p>}
          <input
            className="border-b-2 bg-inherit w-[16rem] h-[3rem] text-white placeholder:text-gray-300 focus:outline-none"
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border-b-2 bg-inherit w-[16rem] h-[3rem] text-white placeholder:text-gray-300 focus:outline-none"
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
         <input
        className="border-b-2 bg-inherit w-[16rem] h-[3rem] text-white placeholder:text-gray-300 focus:outline-none"
         type="text"
         placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        required
                    />
          <button
            type="submit"
            className="mt-4 border-white border-2 rounded-[20px] w-[7rem] h-[3rem] text-white hover:text-mainTextcolor hover:border-mainTextcolor font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>
      </div>
    </>
  );
}