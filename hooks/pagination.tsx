import { useState } from "react";

export function usePagination<T>(totalItems : number, itemsPerPage : number) {
    const [currentPage, setCurrentPage] = useState<number>(0);

    const totalPages: number = Math.ceil(totalItems / itemsPerPage);
    const currentItems = (data: T[]): T[] => data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    return { currentPage, totalPages, currentItems, nextPage, prevPage };
}
