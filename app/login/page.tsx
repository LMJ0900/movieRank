// Main.tsx
'use client'

import { useState } from "react";
import LoginBar from "@/components/auth/loginBar";
import JoinBar from "@/components/auth/joinBar";

export default function Main() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [animationClass, setAnimationClass] = useState<string>('');

  const handleSignUpClick = () => {
    setIsLogin(false);
    setAnimationClass('md:animate-TransRight');
  }

  const handleLoginClick = () => {
    setIsLogin(true);
    setAnimationClass('md:animate-Transleft');
  }

  return (
    <>
      <div className="flex items-center justify-center bg-mainBgcolor  h-[100vh]">
        <div className="relative mt-30">
          <div className="hidden md:flex flex bg-white w-[50rem] h-[30rem] rounded-[10px] z-10 flex-row ">
            {/* 왼쪽 패널 (로그인으로 전환) */}
            <div className="flex items-center flex-col w-[25rem] h-[30rem] justify-center">
              <h2 className="text-[3rem] font-semibold text-subTextcolor">LMJ<br /><p className="text-mainTextcolor">TrendRank</p></h2>
              <h3 className="mt-[3rem] text-mainTextcolor">이미 회원이신가요?</h3>
              <button className="mt-[5rem] border-[--color-pebble-3] text-mainBgcolor border-2 rounded-[20px] w-[7rem] h-[3rem] font-semibold hover:text-subTextcolor" onClick={handleLoginClick}>Login</button>
            </div>
            {/* 오른쪽 패널 (회원가입으로 전환) */}
            <div className="flex items-center flex-col w-[25rem] h-[30rem] justify-center">
              <h2 className="text-[3rem] font-semibold text-maincolor">LMJ<br /><p className="text-subTextcolor">TrendRank</p></h2>
              <h3 className="mt-[3rem] text-mainTextcolor">새로 오셨나요?</h3>
              <button className="mt-[5rem] border-[--color-pebble-2] text-mainBgcolor hover:text-subTextcolor border-2 rounded-[20px] w-[7rem] h-[3rem] font-semibold" onClick={handleSignUpClick}>Sign up</button>
            </div>
          </div>
          {/* 슬라이딩 패널 */}
          <div className={`flex items-center justify-center 
              bg-subBgcolor rounded-[10px] flex-col
              md:absolute md:top-[-7rem] md:left-[1rem] md:h-[40rem] md:w-[24rem] md:z-0 
              h-screen w-screen ${animationClass}`} id="LoginBack">
            {isLogin ? <LoginBar onSwitch={handleSignUpClick} /> : <JoinBar onJoinSuccess={handleLoginClick} onSwitch={handleLoginClick} />}
          </div>
        </div>
      </div>
    </>
  );
}