import { useState } from "react";

export function usePagination(totalItems, itemsPerPage) {
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = (data) => data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    return { currentPage, totalPages, currentItems, nextPage, prevPage };
}
