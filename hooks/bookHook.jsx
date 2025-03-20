import { fetchBestsellerData } from "@/actions/bookAction"
import { useEffect, useState } from "react";

export const usebookData = (apiKey) => {
    const [bookList, setbookList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBestsellerData = async () => {
            const data = await fetchBestsellerData(apiKey);
            setbookList(data);
            setLoading(false);
        };
        getBestsellerData();
    }, [apiKey]);

    return { bookList, loading };
};