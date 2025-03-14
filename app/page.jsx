import { fetchBoxOfficeData, fetchMoviePosters } from "@/actions/movieAction";
import BoxOfficeList from "@/components/boxOfficeList";
import Header from "@/components/header";
import { dateType } from "@/components/dateType"
export default async function Home() {

    // ✅ API 키
    const apiKey = "70e134f822db8560523e77a450abcfa6";
    const apiKey2 = "C216H4982X63Y7C81R74";

    // ✅ 서버에서 API 데이터 가져오기 (박스오피스)
    const movieList = await fetchBoxOfficeData(dateType, apiKey);

    // ✅ 서버에서 API 데이터 가져오기 (포스터)
    const moviePosters = await fetchMoviePosters(movieList, apiKey2);

    return (
        <div className="flex flex-col items-center w-full bg-mainBgcolor">
            <Header />
            <BoxOfficeList movieList={movieList} moviePosters={moviePosters} />
        </div>
    );
}
