import type { User } from "@supabase/supabase-js";

export type UseLoginCheckType = {
    user : User | null;
    loading : boolean
}
export type CommentRowType = {
    id: number;
    user_id: string;
    content: string;
    created_at: string;
    profiles?: { nickname?: string | null } | null;
}
export type MovieDetailType = {
    title : string;
    genre: string;
    director: string;
    plot: string;
    audiAcc: number;
    poster: string | null;
}
type Director = { peopleNm?: string };
export type PosterMap = Record<string, string | undefined | null>;
export type LikeRow = { comment_id: number; user_id: string };

export type MovieItem = {
  movieCd: string | number;
  movieNm: string;
  genreAlt?: string;
  directors?: Director[];
  audiAcc?: number;
  rank: string;
  openDt: string;
  nationAlt: string;
};

export type BoxOfficeListType = {
  movieList: MovieItem[];
  moviePosters: PosterMap;
}