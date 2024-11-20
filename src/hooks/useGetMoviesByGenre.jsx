import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// 로그인된 사용자의 API 키 가져오기 함수
const getApiKeyFromLocalStorage = () => {
    try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const matchedUser = users.find(user => user.email === currentUser.email);
        return matchedUser?.password || ""; // API 키로 사용
    } catch (error) {
        console.error("API 키를 가져오는 중 오류 발생:", error);
        return "";
    }
};

// 영화 데이터를 가져오는 함수
const fetchMoviesByGenre = async (page, genreId, sortBy, apiKey) => {
    if (!apiKey) {
        throw new Error("API 키가 설정되지 않았습니다.");
    }

    const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ko-KR&page=${page}&with_genres=${genreId}&sort_by=${sortBy}&vote_count.gte=10`
    );

    if (!response.ok) {
        throw new Error(`영화 데이터를 가져오는 중 오류 발생: ${response.statusText}`);
    }

    return response.json();
};

// React Query Hook
const useGetMoviesByGenre = (genreId, sortBy) => {
    const [apiKey, setApiKey] = useState("");

    // 컴포넌트 마운트 시 API 키 가져오기
    useEffect(() => {
        const apiKey = getApiKeyFromLocalStorage();
        setApiKey(apiKey);
    }, []);

    return useInfiniteQuery({
        queryKey: ['movies-by-genre', genreId, sortBy],
        queryFn: ({ pageParam = 1 }) => fetchMoviesByGenre(pageParam, genreId, sortBy, apiKey),
        getNextPageParam: (last) => {
            if (last.page < last.total_pages) {
                return last.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!genreId && genreId !== 'select' && !!apiKey, // API 키와 장르 ID가 유효할 때만 쿼리 실행
    });
};

export default useGetMoviesByGenre;
