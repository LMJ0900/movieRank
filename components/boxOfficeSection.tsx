'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBoxOfficeData, fetchMoviePosters } from '@/actions/movieAction';
import BoxOfficeList from './boxOfficeList';
import { getDateType } from '@/components/dateType';
import { MovieItem, PosterMap } from '@/types/type';

export default function BoxOfficeSection() {
  const apiKey = process.env.NEXT_PUBLIC_BOXOFFICE_API_KEY;
  const apiKey2 = process.env.NEXT_PUBLIC_MOVIEPOSTER_API_KEY;
  const dateType = getDateType();

  const {
    data: movieList = [],
    isLoading,
    isError,
  } = useQuery<MovieItem[]>({
    queryKey: ['boxOffice', dateType, apiKey],
    queryFn: () => fetchBoxOfficeData(dateType, apiKey as string),
    enabled: !!apiKey,
    staleTime: 1000 * 60 * 10, //10분 캐싱
  });

  const {
    data: moviePosters = {},
    isLoading: postersLoading,
    isError: postersError,
  } = useQuery<PosterMap>({
    queryKey: ['moviePosters', movieList, apiKey2],
    queryFn: () => fetchMoviePosters(movieList, apiKey2 as string),
    enabled: !!apiKey2 && movieList.length > 0,
    staleTime: 1000 * 60 * 10,
  });
  if (!!apiKey && !!apiKey2) return <p>환경변수가 설정되지 않았습니다.</p>;
  if (isLoading || postersLoading) return <p>로딩 중...</p>;
  if (isError || postersError) return <p>에러가 발생했습니다.</p>;

  return <BoxOfficeList movieList={movieList} moviePosters={moviePosters} />;
}
