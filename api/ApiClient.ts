import { getDateType } from "@/components/dateType";

type ApiType = "movie" | "moviePoster";

interface ApiClientProps {
  apiType: ApiType;
  data?: any;
  cache?: RequestCache;
}

const API_KEYS = {
  movie: process.env.NEXT_PUBLIC_BOXOFFICE_API_KEY,
  moviePoster: process.env.NEXT_PUBLIC_MOVIEPOSTER_API_KEY,
  book: process.env.NEXT_PUBLIC_BOOK_API_KEY,
};

const buildUrl = (apiType: ApiType, data?: any): string => {
  switch (apiType) {
    case "movie": {
      const dateType = data?.dateType;

      if (!API_KEYS.movie) {
        throw new Error("환경변수 누락: NEXT_PUBLIC_BOXOFFICE_API_KEY");
      }
      if (!dateType) {
        throw new Error("movie API에 dateType이 필요합니다.");
      }

      return `https://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${API_KEYS.movie}&targetDt=${dateType}`;
    }

    case "moviePoster": {
      const movieNm: string | undefined = data?.movieNm;
      const releaseDts: string | undefined = data?.releaseDts;

      if (!API_KEYS.moviePoster) {
        throw new Error("환경변수 누락: NEXT_PUBLIC_MOVIEPOSTER_API_KEY");
      }
      if (!movieNm || !releaseDts) {
        throw new Error("moviePoster API에 movieNm, releaseDts가 필요합니다.");
      }

      return `https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&title=${encodeURIComponent(
        movieNm
      )}&releaseDts=${releaseDts}&ServiceKey=${API_KEYS.moviePoster}`;
    }

    default: {
      const _exhaustive: never = apiType;
      throw new Error(`지원하지 않는 apiType: ${_exhaustive}`);
    }
  }
};

export const apiClient = async <T = any>({ apiType, data, cache = "default" }: ApiClientProps): Promise<T> => {
  const url = buildUrl(apiType, data);

  const res = await fetch(url, { cache });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[${apiType}] ${res.status} ${res.statusText} ${text}`);
  }

  return (await res.json()) as T;
};
