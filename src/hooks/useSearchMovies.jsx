import { useInfiniteQuery } from '@tanstack/react-query';

const useSearchMovies = (searchQuery) => {
  return useInfiniteQuery({
    queryKey: ['searchMovies', searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      if (!searchQuery) return { results: [], total_pages: 0 };
      
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=8cc1274fb9b4939dd84d9741f37e166e&language=ko-KR&query=${encodeURIComponent(searchQuery)}&page=${pageParam}`
      );
      return response.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: !!searchQuery,
  });
};

export default useSearchMovies;