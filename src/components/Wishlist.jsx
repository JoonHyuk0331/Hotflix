import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import '../App.css';
import Movie from "./Movie";
import { ArrowUp } from "lucide-react";

function Wishlist() {
    const [viewedMovies, setViewedMovies] = useState([]);
    const [displayedMovies, setDisplayedMovies] = useState([]);
    const [page, setPage] = useState(1);
    const moviesPerPage = 20;
    const {ref, inView} = useInView();

    // 초기 로드 시 로컬 스토리지에서 영화 ID 목록을 가져옴
    useEffect(() => {
        const savedMovies = JSON.parse(localStorage.getItem('viewedMovies') || '[]');
        setViewedMovies(savedMovies);
    }, []);

    // API를 통해 영화 상세 정보를 가져오는 함수
    const fetchMovieDetails = async (movieId) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?language=ko&api_key=8cc1274fb9b4939dd84d9741f37e166e`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch movie details:", error);
            return null;
        }
    };

    // 페이지에 표시할 영화들의 상세 정보를 가져옴
    useEffect(() => {
        const loadMoreMovies = async () => {
            const startIndex = (page - 1) * moviesPerPage;
            const endIndex = startIndex + moviesPerPage;
            const currentPageMovies = viewedMovies.slice(startIndex, endIndex);

            if (currentPageMovies.length > 0) {
                const movieDetails = await Promise.all(
                    currentPageMovies.map(movieId => fetchMovieDetails(movieId))
                );
                
                const validMovies = movieDetails.filter(movie => movie !== null);
                setDisplayedMovies(prev => [...prev, ...validMovies]);
            }
        };

        loadMoreMovies();
    }, [page, viewedMovies]);

    // Intersection Observer로 무한 스크롤 구현
    useEffect(() => {
        if (inView && viewedMovies.length > displayedMovies.length) {
            setPage(prev => prev + 1);
        }
    }, [inView, viewedMovies.length, displayedMovies.length]);

    // 날짜 포맷팅 함수
    const formatDate = (dateStr) => {
        if (!dateStr) return '미정';
        return dateStr.split('-').slice(0, 2).join('.');
    };

    return (
        <div>
            <div className="headbar"></div>
            <h1 className="page-title">관심 있는 영화 목록</h1>
            {displayedMovies.length === 0 ? (
                <div className="empty-message">
                    관심 있는 영화가 없습니다.
                </div>
            ) : (
                <>
                    <div className="grid-container">
                        {displayedMovies.map((movie) => (
                            <Movie key={movie.id} movie={movie} />
                        ))}
                    </div>
                    <div ref={ref} className="loading-indicator">
                        {viewedMovies.length > displayedMovies.length && <h1>Loading...</h1>}
                    </div>
                </>
            )}
        </div>
    );
}

export default Wishlist;