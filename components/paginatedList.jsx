'use client';

import { usePagination } from "@/hooks/pagination";


export default function PaginatedList({ items, renderItem, itemsPerPage = 5, title }) {
    const { currentPage, totalPages, currentItems, nextPage, prevPage } = usePagination(items.length, itemsPerPage);

    const currentItemsList = currentItems(items);

    return (
        <div className="w-[90%] mt-20">
            <h1 className="text-3xl font-bold text-left my-6 text-mainTextcolor">{title}</h1>
            <div className="relative w-full flex items-center">
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 0} 
                    className={`absolute left-0 p-2 text-white bg-black bg-opacity-50 rounded-full ${
                        currentPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-opacity-70"
                    }`}
                >
                    ◀
                </button>

                {/* 리스트 렌더링 */}
                <div className="flex space-x-6 overflow-hidden w-full justify-center">
                    {currentItemsList.map(renderItem)}
                </div>

                {/* 다음 버튼 */}
                <button 
                    onClick={nextPage} 
                    disabled={currentPage >= totalPages - 1} 
                    className={`absolute right-0 p-2 text-white bg-black bg-opacity-50 rounded-full ${
                        currentPage >= totalPages - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-opacity-70"
                    }`}
                >
                    ▶
                </button>
            </div>
        </div>
    );
}
