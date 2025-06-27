import { fetchBoxOfficeData, fetchMoviePosters } from "@/actions/movieAction";
import { fetchBestsellerData } from "@/actions/bookAction";
import BoxOfficeList from "@/components/boxOfficeList";
import BestsellerList from "@/components/bestsellerList"
import Header from "@/components/header";
import { getDateType } from "@/components/dateType";
import InitBestSeller from "@/components/InitBestSeller";
import InitBoxOffice from '@/components/InitBoxOffice'
export const dynamic = 'force-dynamic';

export default async function Home() {

    // ✅ API 키
    const apiKey = process.env.NEXT_PUBLIC_BOXOFFICE_API_KEY;
    const apiKey2 = process.env.NEXT_PUBLIC_MOVIEPOSTER_API_KEY;
    const bookApikey = process.env.NEXT_PUBLIC_BOOK_API_KEY;

    const dateType = getDateType(); 
    // ✅ 서버에서 API 데이터 가져오기 (박스오피스)
    const movieList = await fetchBoxOfficeData(dateType, apiKey);

    // ✅ 서버에서 API 데이터 가져오기 (포스터)
    const moviePosters = await fetchMoviePosters(movieList, apiKey2);

    const bestSellerList = await fetchBestsellerData(bookApikey)
    return (
        <div className="flex flex-col items-center w-full bg-mainBgcolor min-h-[100vh]">
            <Header />
            <InitBestSeller bookList={bestSellerList} />
            <InitBoxOffice movieList={movieList} moviePosters={moviePosters} />
            <BoxOfficeList movieList={movieList} moviePosters={moviePosters} />
            <BestsellerList bestsellerList={bestSellerList}/>
        </div>
    );
}
