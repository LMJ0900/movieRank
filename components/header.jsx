"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react"; // 아이콘 라이브러리 사용

export default function header() {
    const [search, setSearch] = useState("");

    return (
        <header className="bg-subBgcolor shadow-md fixed w-full top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* 🔹 로고 */}
                <Link href="/" className="text-2xl font-bold text-maincolor">
                    LMJMovie
                </Link>

                {/* 🔹 네비게이션 */}
                <nav className="hidden md:flex space-x-6">
                    <Link href="/movies" className="text-subcolor hover:text-hovercolor">영화</Link>
                    <Link href="/tv" className="text-subcolor hover:text-hovercolor">TV 프로그램</Link>
                    <Link href="/books" className="text-subcolor hover:text-hovercolor">책</Link>
                    <Link href="/trending" className="text-subcolor hover:text-hovercolor">트렌드</Link>
                </nav>

                {/* 🔹 검색창 & 유저 메뉴 */}
                <div className="flex items-center space-x-4">
                    {/* 🔹 검색 */}
                    <div className="relative hidden md:block text-mainTextcolor">
                        <input
                            type="text"
                            placeholder="검색"
                            className="border rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2 text-gray-500" size={18} />
                    </div>

                    {/* 🔹 로그인 / 회원가입 */}
                    <Link href="/login" className="hidden md:block bg-maincolor text-white px-4 py-2 rounded-full">
                        로그인
                    </Link>

                    {/* 🔹 유저 아이콘 (로그인 상태일 때) */}
                    <User className="md:hidden text-gray-500 cursor-pointer" size={28} />
                </div>
            </div>
        </header>
    );
}
