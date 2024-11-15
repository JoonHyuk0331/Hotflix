import { useInfiniteQuery } from "@tanstack/react-query";

const fetchMoviesByGenre = async (page, genreId, sortBy) => {
    const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=8cc1274fb9b4939dd84d9741f37e166e&language=ko-KR&page=${page}&with_genres=${genreId}&sort_by=${sortBy}&vote_count.gte=10`
    );
    return response.json();
};

const useGetMoviesByGenre = (genreId, sortBy) => {
    return useInfiniteQuery({
        queryKey: ['movies-by-genre', genreId, sortBy],
        queryFn: ({pageParam}) => {
            return fetchMoviesByGenre(pageParam, genreId, sortBy)
        },
        getNextPageParam: (last) => {
            if(last.page < last.total_pages) {
                return last.page + 1
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!genreId && genreId !== 'select',
    });
};

export default useGetMoviesByGenre;