// Main.tsx
'use client'

import { useState } from "react";
import LoginBar from "@/components/auth/loginBar";
import JoinBar from "@/components/auth/joinBar";

export default function Main() {
  const [isLogin, setIsLogin] = useState(true);
  // 💡 [수정] 애니메이션 클래스를 관리할 별도의 state 추가
  const [animationClass, setAnimationClass] = useState('');

  const handleSignUpClick = () => {
    setIsLogin(false);
    // 💡 [수정] 오른쪽으로 가는 애니메이션 클래스 적용
    setAnimationClass('animate-TransRight');
  }

  const handleLoginClick = () => {
    setIsLogin(true);
    // 💡 [수정] 왼쪽으로 가는 애니메이션 클래스 적용
    setAnimationClass('animate-Transleft');
  }

  return (
    <>
      <div className="flex items-center justify-center bg-mainBgcolor  h-[100vh]">
        <div className="relative mt-30">
          <div className="flex bg-white w-[50rem] h-[30rem] rounded-[10px] z-10 flex-row">
            {/* 왼쪽 패널 (로그인으로 전환) */}
            <div className="flex items-center flex-col w-[25rem] h-[30rem] justify-center">
              <h2 className="text-[3rem] font-semibold text-gray-200">LMJ<br /><p className="text-maincolor">TrendRank</p></h2>
              <h3 className="mt-[3rem]">이미 회원이신가요?</h3>
              <button className="mt-[5rem] border-[--color-pebble-3] text-[--color-pebble-3] border-2 rounded-[20px] w-[7rem] h-[3rem] font-semibold hover:text-[#872642]" onClick={handleLoginClick}>Login</button>
            </div>
            {/* 오른쪽 패널 (회원가입으로 전환) */}
            <div className="flex items-center flex-col w-[25rem] h-[30rem] justify-center">
              <h2 className="text-[3rem] font-semibold text-maincolor">LMJ<br /><p className="text-gray-200">TrendRank</p></h2>
              <h3 className="mt-[3rem]">새로 오셨나요?</h3>
              <button className="mt-[5rem] border-[--color-pebble-2] text-[--color-pebble-2] hover:text-[#872642] border-2 rounded-[20px] w-[7rem] h-[3rem] font-semibold" onClick={handleSignUpClick}>Sign up</button>
            </div>
          </div>
          {/* 슬라이딩 패널 */}
          {/* 💡 [수정] state에 저장된 애니메이션 클래스를 동적으로 적용 */}
          <div className={`flex items-center absolute top-[-7rem] left-[1rem] h-[40rem] w-[24rem] bg-subBgcolor rounded-[10px] flex-col z-0 ${animationClass}`} id="LoginBack">
            {isLogin ? <LoginBar /> : <JoinBar onJoinSuccess={handleLoginClick} />}
          </div>
        </div>
      </div>
    </>
  );
}