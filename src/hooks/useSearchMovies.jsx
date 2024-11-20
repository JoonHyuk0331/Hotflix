import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

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

// React Query Hook
const useSearchMovies = (searchQuery) => {
    const [apiKey, setApiKey] = useState("");

    // 컴포넌트 마운트 시 API 키 가져오기
    useEffect(() => {
        const apiKey = getApiKeyFromLocalStorage();
        setApiKey(apiKey);
    }, []);

    return useInfiniteQuery({
        queryKey: ['searchMovies', searchQuery],
        queryFn: async ({ pageParam = 1 }) => {
            if (!searchQuery) return { results: [], total_pages: 0 };
            if (!apiKey) {
                console.error("API 키가 설정되지 않았습니다.");
                return { results: [], total_pages: 0 };
            }

            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&query=${encodeURIComponent(searchQuery)}&page=${pageParam}`
            );

            if (!response.ok) {
                throw new Error(`영화 검색 중 오류 발생: ${response.statusText}`);
            }

            return response.json();
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.page < lastPage.total_pages) {
                return lastPage.page + 1;
            }
            return undefined; // 더 이상 페이지가 없음
        },
        enabled: !!searchQuery && !!apiKey, // 검색어와 API 키가 설정된 경우에만 쿼리 실행
    });
};

export default useSearchMovies;
