"use client";

import { useQuery } from "@tanstack/react-query";
import { MovieQuery } from "@/api/movie/Movie.query";
import { getDateType } from "@/components/dateType";
import InitBestSeller from "@/components/InitBestSeller";
import InitBoxOffice from "@/components/InitBoxOffice";
import BoxOfficeList from "@/components/boxOfficeList";
import BestsellerList from "@/components/bestsellerList";
import { BookQuery } from "@/api/book/Book.query";

export default function HomeClient() {
  const dateType = getDateType();

  const {data : boxOfficeList} = useQuery({
    queryKey: ["boxoffice", dateType],
    queryFn: () => MovieQuery.getBoxOfficeList(dateType),
  });

  const {data : moviePosterData } = useQuery({
    queryKey: ["posters", dateType],
    enabled: !!boxOfficeList?.length,
    queryFn: () => MovieQuery.getPostersForBoxOfficeList(boxOfficeList!),
  });

  const bestSellerQuery = useQuery({
    queryKey: ["bestseller"],
    queryFn: () => BookQuery.getBestsellerList(),
  });

  const movieList = boxOfficeList ?? [];
  const moviePosters = moviePosterData ?? {};
  const bestSellerList = bestSellerQuery.data ?? [];

  return (<>
    <InitBestSeller bookList={bestSellerList} />
    <InitBoxOffice movieList={movieList} moviePosters={moviePosters} />
    <BoxOfficeList movieList={movieList} moviePosters={moviePosters} />
    <BestsellerList bestsellerList={bestSellerList}/>
  </>);
}
