// /queries/MovieQuery.ts
import { MovieItem, PosterMap } from "@/types/type";
import { apiClient } from "@/api/ApiClient";

export class MovieQuery {
  static async getBoxOfficeList(dateType: string): Promise<MovieItem[]> {
    try {
      const data = await apiClient<any>({
        apiType: "movie",
        data: { dateType },
      });

      return (data?.boxOfficeResult?.dailyBoxOfficeList ?? []) as MovieItem[];
    } catch (error) {
      console.log("🚨 박스오피스 API 오류:", error);
      return [];
    }
  }

  static async getPostersForBoxOfficeList(movieList: MovieItem[]): Promise<PosterMap> {
    if (!movieList?.length) return {};

    const postersData: PosterMap = {};

    await Promise.all(
      movieList.map(async (movie) => {
        const releaseDts = movie.openDt.replaceAll("-", "");

        try {
          const data = await apiClient<any>({
            apiType: "moviePoster",
            data: { movieNm: movie.movieNm, releaseDts },
          });

          const movieData = data?.Data?.[0]?.Result?.[0];
          if (movieData?.posters) {
            const posterUrls = movieData.posters.split("|");
            postersData[movie.movieCd] = posterUrls[0] ?? null;
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
  }
}
