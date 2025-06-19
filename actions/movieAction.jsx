
export const fetchBoxOfficeData = async (dateType, apiKey) => {
    const boxOfficeUrl = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${apiKey}&targetDt=${dateType}`;
    try {
        const res = await fetch(boxOfficeUrl);
        if (!res.ok) {
            throw new Error('400 아니면 500 에러');
        }
        const data = await res.json();
        return data.boxOfficeResult.dailyBoxOfficeList;
    } catch (error) {
        console.log("🚨 박스오피스 API 오류:", error);
        return [];
    }
};

export const fetchMoviePosters = async (movieList, apiKey2) => {
    if (movieList.length === 0) return {}; // 영화 데이터가 없으면 빈 객체 반환

    const postersData = {};

    await Promise.all(
        movieList.map(async (movie) => {
            const releaseDts = movie.openDt.replaceAll("-", "");
            const kmdbUrl = `https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&title=${movie.movieNm}&releaseDts=${releaseDts}&ServiceKey=${apiKey2}`;

            console.log("📡 요청 URL:", kmdbUrl); // 요청 URL 확인

            try {
                const response = await fetch(kmdbUrl);
                const data = await response.json();

                console.log("🔍 KMDb API 응답 데이터:", JSON.stringify(data, null, 2)); // 응답 데이터 확인

                // 데이터 안전하게 접근
                const movieData = data?.Data?.[0]?.Result?.[0];
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
        })
    );

    return postersData;
};

