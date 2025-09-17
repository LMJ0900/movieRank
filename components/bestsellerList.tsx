'use client';

import PaginatedList from "@/components/paginatedList";
import Link from "next/link";
import Image from "next/image";
import { BookItem } from "@/types/type";
export default function BestsellerList({ bestsellerList } : {bestsellerList : BookItem[]}) {
    console.log("📌 [클라이언트] bestsellerList:", bestsellerList); // ✅ 디버깅용

    return (
        <PaginatedList
            title="베스트셀러 순위"
            items={bestsellerList}
            renderItem={(book) => (
                <Link href={`/book/${book.itemId}`} key={book.itemId} className="flex flex-col items-center">
                    <div className="relative">
                        <Image 
                            className="w-48 h-72 rounded-lg object-cover shadow-lg" 
                            src={book.cover} 
                            width={500} height={500}
                            quality={100}
                            alt="도서 포스터" 
                        />
                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm">
                            {book.isbn}
                        </div>
                    </div>
                    <h2 className="text-lg text-mainTextcolor font-semibold mt-3 w-[14rem] text-center line-clamp-2">{book.title}</h2>
                    <p className="text-subTextcolor">{book.pubDate}</p>
                    <p className="text-sm text-subTextcolor">가격 : {book.price}</p>
                </Link>
            )}
        />
    );
}
