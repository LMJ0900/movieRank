'use client';

import { usePagination } from "@/hooks/pagination";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
export default function PaginatedList<T>({ items, renderItem, itemsPerPage = 5, title} : {items: T[], renderItem: (item: T, index: number)=> ReactNode, itemsPerPage?: number,title:string}) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { currentPage, totalPages, currentItems, nextPage, prevPage } = usePagination<T>(items.length, itemsPerPage);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640); // Tailwind sm 기준
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentItemsList = currentItems(items);

  return (
    <div className="w-[90%] mt-20 mx-auto">
      <h1 className="text-3xl font-bold text-left my-6 text-mainTextcolor">{title}</h1>

      <div className="relative w-full flex items-center">
        {/* ✅ PC: 페이지네이션 모드 */}
        {!isMobile && (
          <>
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`absolute left-0 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full ${
                currentPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-opacity-70"
              }`}
            >
              ◀
            </button>

            <div className="flex space-x-6 overflow-hidden w-full justify-center px-10">
              {currentItemsList.map(renderItem)}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
              className={`absolute right-0 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full ${
                currentPage >= totalPages - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-opacity-70"
              }`}
            >
              ▶
            </button>
          </>
        )}

        {/* ✅ 모바일: 전체 리스트 스크롤 모드 */}
        {isMobile && (
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide w-full px-2">
            {items.map(renderItem)}
          </div>
        )}
      </div>
    </div>
  );
}
