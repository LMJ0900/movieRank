'use client';

import { useQuery } from '@tanstack/react-query';
import BoxOfficeList from './boxOfficeList';
import { getDateType } from '@/components/dateType';
import { MovieItem, PosterMap } from '@/types/type';
import { MovieQuery } from '@/api/movie/Movie.query';

export default function BoxOfficeSection() {
  const dateType = getDateType();

  const {
    data: movieList = [],
    isLoading,
    isError,
  } = useQuery<MovieItem[]>({
    queryKey: ['boxOffice', dateType],
    queryFn: () => MovieQuery.getBoxOfficeList(dateType),
    staleTime: 1000 * 60 * 10, //10분 캐싱
  });

  const {
    data: moviePosters = {},
    isLoading: postersLoading,
    isError: postersError,
  } = useQuery<PosterMap>({
    queryKey: ['moviePosters', movieList],
    queryFn: () => MovieQuery.getPostersForBoxOfficeList(movieList),
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading || postersLoading) return <p>로딩 중...</p>;
  if (isError || postersError) return <p>에러가 발생했습니다.</p>;

  return <BoxOfficeList movieList={movieList} moviePosters={moviePosters} />;
}
