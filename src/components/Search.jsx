import React, { useEffect, useState } from "react";
import useGetTopRatedMovies from "../hooks/useGetTopRatedMovies";
import useGetMoviesByGenre from "../hooks/useGetMoviesByGenre";
import '../App.css';
import { useInView } from "react-intersection-observer";
import { ArrowUpDown } from 'lucide-react';
import Movie from "./Movie";

function Search() {
    const [selectedGenre, setSelectedGenre] = useState('select');
    const [sortConfig, setSortConfig] = useState({
        type: 'vote_average',  // 'vote_average' or 'primary_release_date'
        order: 'desc'         // 'desc' or 'asc'
    });
    const {ref, inView} = useInView();

    // Top Rated Movies Query
    const {
        data: topRatedData,
        fetchNextPage: fetchNextTopRated,
        hasNextPage: hasNextTopRated,
        isFetchingNextPage: isFetchingNextTopRated
    } = useGetTopRatedMovies();

    // Movies by Genre Query with Sort
    const {
        data: genreData,
        fetchNextPage: fetchNextGenre,
        hasNextPage: hasNextGenre,
        isFetchingNextPage: isFetchingNextGenre
    } = useGetMoviesByGenre(selectedGenre, `${sortConfig.type}.${sortConfig.order}`);

    useEffect(() => {
        if (inView) {
            if (selectedGenre === 'select' && hasNextTopRated && !isFetchingNextTopRated) {
                fetchNextTopRated();
            } else if (selectedGenre !== 'select' && hasNextGenre && !isFetchingNextGenre) {
                fetchNextGenre();
            }
        }
    }, [inView, selectedGenre]);

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    };

    // 정렬 토글 핸들러
    const handleSortToggle = (type) => {
        setSortConfig(prev => {
            if (prev.type === type) {
                // 같은 버튼을 눌렀을 때는 오름차순/내림차순 토글
                return {
                    type: type,
                    order: prev.order === 'desc' ? 'asc' : 'desc'
                };
            } else {
                // 다른 버튼을 눌렀을 때는 해당 타입으로 변경하고 내림차순으로 시작
                return {
                    type: type,
                    order: 'desc'
                };
            }
        });
    };

    // 정렬 상태 표시 텍스트
    const getSortLabel = (type) => {
        const isActive = sortConfig.type === type;
        const orderText = sortConfig.order === 'desc' ? '높은순' : '낮은순';
        
        if (type === 'vote_average') {
            return isActive ? `평점 ${orderText}` : '평점순';
        } else {
            return isActive ? `최신순 ${sortConfig.order === 'desc' ? '→' : '←'}` : '개봉일순';
        }
    };

    const currentData = selectedGenre === 'select' ? topRatedData : genreData;

    // 날짜 포맷팅 함수
    const formatDate = (dateStr) => {
        if (!dateStr) return '미정';
        return dateStr.split('-').slice(0, 2).join('.');
    };

    return (
        <div>
            <div className="headbar"></div>
            <div className="controls-container">
                <form id="genreForm">
                    <label htmlFor="genre">장르</label>
                    <select 
                        name="genre" 
                        id="genre" 
                        value={selectedGenre}
                        onChange={handleGenreChange}
                    >
                        <option value="select">영화 장르 선택</option>
                        <option value="28">액션</option>
                        <option value="12">어드밴처</option>
                        <option value="16">애니메이션</option>
                        <option value="35">코미디</option>
                        <option value="80">범죄</option>
                    </select>
                </form>
                
                {selectedGenre !== 'select' && (
                    <div className="sort-controls">
                        <button 
                            onClick={() => handleSortToggle('vote_average')}
                            className={`sort-button ${sortConfig.type === 'vote_average' ? 'active' : ''}`}
                        >
                            <span>{getSortLabel('vote_average')}</span>
                            <ArrowUpDown 
                                className={`sort-icon ${sortConfig.type === 'vote_average' ? 'visible' : ''}`} 
                                size={16}
                            />
                        </button>
                        <button 
                            onClick={() => handleSortToggle('primary_release_date')}
                            className={`sort-button ${sortConfig.type === 'primary_release_date' ? 'active' : ''}`}
                        >
                            <span>{getSortLabel('primary_release_date')}</span>
                            <ArrowUpDown 
                                className={`sort-icon ${sortConfig.type === 'primary_release_date' ? 'visible' : ''}`}
                                size={16}
                            />
                        </button>
                    </div>
                )}
            </div>
            <div className="grid-container">
                {currentData?.pages.map((page) =>
                    page.results.map((movie) => (
                        <Movie key={movie.id} movie={movie} />
                    ))
                )}
            </div>
            <div ref={ref} className="loading-indicator">
                {(hasNextTopRated || hasNextGenre) && <h1>Loading...</h1>}
            </div>
        </div>
    );
}

export default Search;