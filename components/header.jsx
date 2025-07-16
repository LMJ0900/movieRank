"use client";

import Link from "next/link";
import { Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLoginCheck } from "@/hooks/Auth"; // ✅ 커스텀 훅 사용

export default function Header() {
    const { user, loading } = useLoginCheck(); // ✅ 로그인 상태 가져오기
    const router = useRouter();

    return (
        <header className="bg-subBgcolor shadow-md fixed w-full top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* 🔹 로고 */}
                <Link href="/" className="text-2xl font-bold text-maincolor">
                    LMJMovie
                </Link>

                {/* 🔹 네비게이션 */}
                <nav className="hidden md:flex space-x-6">
                    <Link href="/movies" className="text-subcolor hover:text-hovercolor">영화(준비중)</Link>
                    <Link href="/tv" className="text-subcolor hover:text-hovercolor">TV 프로그램(준비중)</Link>
                    <Link href="/books" className="text-subcolor hover:text-hovercolor">책(준비중)</Link>
                    <Link href="/trending" className="text-subcolor hover:text-hovercolor">트렌드(준비중)</Link>
                </nav>

                {/* 🔹 검색창 & 유저 메뉴 */}
                <div className="flex items-center space-x-4">
                    {/* 🔹 검색 */}
                    <div className="relative hidden md:block text-mainTextcolor">
                        <input
                            type="text"
                            placeholder="검색"
                            className="border rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                        <Search className="absolute left-3 top-2 text-gray-500" size={18} />
                    </div>

                    {/* 🔹 로그인 / 마이페이지 */}
                    {loading ? (
                        <span className="text-gray-500">로딩 중...</span>
                    ) : user ? (
                        // ✅ 로그인 상태 → 유저 아이콘 (마이페이지로 이동)
                        <User
                            className="text-gray-500 cursor-pointer"
                            size={28}
                            onClick={() => router.push("/mypage")}
                        />
                    ) : (
                        // ✅ 로그아웃 상태 → 로그인 버튼
                        <Link href="/login" className=" md:block bg-maincolor text-white px-4 py-2 rounded-full">
                            로그인
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
