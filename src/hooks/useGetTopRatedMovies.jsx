import { useInfiniteQuery } from "@tanstack/react-query";

const fetchTopRatedMovies=async (page)=>{
    const response=await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=8cc1274fb9b4939dd84d9741f37e166e&language=ko-KR&page=${page}`);
    return response.json();
};

const useGetTopRatedMovies=()=>{
    return useInfiniteQuery({
        queryKey:['top-rated-movie'],
        queryFn:({pageParam})=>{
            return fetchTopRatedMovies(pageParam)
        },
        getNextPageParam:(last)=>{
            if(last.page<last.total_pages){
                return last.page+1
            }
            return undefined;//끝
        },
        initialPageParam: 1
    });
};

export default useGetTopRatedMovies;