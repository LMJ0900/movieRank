'use client'

import { useEffect, useState } from "react";

export default function Home() {
    const [movieList, setMovieList] = useState([]); // 박스오피스 영화 목록
    const [moviePosters, setMoviePosters] = useState({}); // 포스터 정보 저장
    const [loading, setLoading] = useState(true);

    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let year = yesterday.getFullYear().toString();
    let month = (yesterday.getMonth() + 1).toString().padStart(2, '0');
    let date = yesterday.getDate().toString().padStart(2, '0');
    const dateType = `${year}${month}${date}`;

    const apiKey = "70e134f822db8560523e77a450abcfa6";
    const apiKey2 = "C216H4982X63Y7C81R74";

    const boxOfficeUrl = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${apiKey}&targetDt=${dateType}`;

    // ✅ 1. 박스오피스 데이터 가져오기
    useEffect(() => {
        fetch(boxOfficeUrl)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('400 아니면 500 에러');
                }
                return res.json();
            })
            .then((res) => {
                setMovieList(res.boxOfficeResult.dailyBoxOfficeList);
            })
            .catch(() => {
                console.log("순위 API 오류입니다.");
            })
            .finally(() => setLoading(false));
    }, []);

    // ✅ 2. KMDb API에서 포스터 가져오기
    useEffect(() => {
        if (movieList.length === 0) return; // ✅ API 응답 실패 시 다시 요청 가능하도록 수정

        const fetchPosters = async () => {
            const postersData = {};

            await Promise.all(
                movieList.map(async (movie) => {
                    const releaseDts = movie.openDt.replaceAll("-","")
                    const kmdbUrl = `https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&title=${movie.movieNm}&releaseDts=${releaseDts}&ServiceKey=${apiKey2}`;

                    console.log("📡 요청 URL:", kmdbUrl); // URL 확인

                    try {
                        const response = await fetch(kmdbUrl);
                        const data = await response.json();

                        console.log("🔍 KMDb API 응답 데이터:", JSON.stringify(data, null, 2)); // 응답 데이터 확인

                        // 안전한 데이터 접근
                        const movieData = data?.Data?.[0]?.Result?.[0]; // 옵셔널 체이닝 사용
                        if (movieData && movieData.posters) {
                            const posterUrls = movieData.posters.split("|");
                            postersData[movie.movieCd] = posterUrls.length > 0 ? posterUrls[0] : null;
                        } else {
                            postersData[movie.movieCd] = null;
                        }
                    } catch (error) {
                        console.error("🚨 KMDb API 요청 오류:", error);
                        postersData[movie.movieCd] = null;
                    }
                    console.log(`포스터 데이터 확인 : ${JSON.stringify(postersData)}`)
                })
                
            );

            setMoviePosters((prev) => ({ ...prev, ...postersData })); // 기존 데이터 유지
        };

        fetchPosters();
    }, [movieList]);
    console.log(`무비이미지 상태 배열 확인 :  ${JSON.stringify(moviePosters)}`)
    return (
      <div>
          {loading ? (
              <h1>Loading...</h1>
          ) : (
              <div>
                  {movieList.map((movie) => (
                      <div className="영화컨테이너 flex flex-row" key={movie.movieCd} style={{ marginBottom: "20px" }}>
                          {moviePosters[movie.movieCd] ? (
                              <img className="flex" src={moviePosters[movie.movieCd]} alt="영화 포스터" style={{ width: "200px", borderRadius: "10px" }} />
                          ) : (
                              <p>❌ 포스터 없음</p>
                          )}
                          <div className="영화정보 flex flex-col ml-[1rem] mt-[3rem] gap-[0.3rem]">
                          <h2>{movie.rank}위 {movie.movieNm}</h2>
                          <h4>개봉일: {movie.openDt}</h4>
                          <p>일일 관객수: {movie.audiCnt}</p>
                          <p>누적 관객수: {movie.audiAcc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
  );  
}
