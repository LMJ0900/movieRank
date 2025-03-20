import { fetchBoxOfficeData, fetchMoviePosters } from "@/actions/movieAction";
import { fetchBestsellerData } from "@/actions/bookAction";
import BoxOfficeList from "@/components/boxOfficeList";
import BestsellerList from "@/components/bestsellerList"
import Header from "@/components/header";
import { dateType } from "@/components/dateType"
export default async function Home() {

    // ✅ API 키
    const apiKey = process.env.NEXT_PUBLIC_BOXOFFICE_API_KEY;
    const apiKey2 = process.env.NEXT_PUBLIC_MOVIEPOSTER_API_KEY;
    const bookApikey = process.env.NEXT_PUBLIC_BOOK_API_KEY;

    
    // ✅ 서버에서 API 데이터 가져오기 (박스오피스)
    const movieList = await fetchBoxOfficeData(dateType, apiKey);

    // ✅ 서버에서 API 데이터 가져오기 (포스터)
    const moviePosters = await fetchMoviePosters(movieList, apiKey2);

    const bestSellerList = await fetchBestsellerData(bookApikey)
    
    console.log(bestSellerList)
    return (
        <div className="flex flex-col items-center w-full bg-mainBgcolor">
            <Header />
            <BoxOfficeList movieList={movieList} moviePosters={moviePosters} />
            <BestsellerList bestsellerList={bestSellerList}/>
        </div>
    );
}
