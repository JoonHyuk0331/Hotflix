import React, { useEffect, useState } from "react";
import useGetTopRatedMovies from "../hooks/useGetTopRatedMovies";
import useGetMoviesByGenre from "../hooks/useGetMoviesByGenre";
import useSearchMovies from "../hooks/useSearchMovies";
import '../App.css';
import { useInView } from "react-intersection-observer";
import { ArrowUpDown, Search as SearchIcon } from 'lucide-react';
import Movie from "./Movie";
import { ArrowUp } from "lucide-react";

// 맨 위로 스크롤
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

function Search() {
    const [selectedGenre, setSelectedGenre] = useState('select');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({
        type: 'vote_average',
        order: 'desc'
    });
    const {ref, inView} = useInView();

    // 검색어 디바운싱
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Queries
    const {
        data: topRatedData,
        fetchNextPage: fetchNextTopRated,
        hasNextPage: hasNextTopRated,
        isFetchingNextPage: isFetchingNextTopRated
    } = useGetTopRatedMovies();

    const {
        data: genreData,
        fetchNextPage: fetchNextGenre,
        hasNextPage: hasNextGenre,
        isFetchingNextPage: isFetchingNextGenre
    } = useGetMoviesByGenre(selectedGenre, `${sortConfig.type}.${sortConfig.order}`);

    const {
        data: searchData,
        fetchNextPage: fetchNextSearch,
        hasNextPage: hasNextSearch,
        isFetchingNextPage: isFetchingNextSearch
    } = useSearchMovies(debouncedQuery);

    useEffect(() => {
        if (inView) {
            if (debouncedQuery && hasNextSearch && !isFetchingNextSearch) {
                fetchNextSearch();
            } else if (selectedGenre === 'select' && hasNextTopRated && !isFetchingNextTopRated) {
                fetchNextTopRated();
            } else if (selectedGenre !== 'select' && hasNextGenre && !isFetchingNextGenre) {
                fetchNextGenre();
            }
        }
    }, [inView, selectedGenre, debouncedQuery]);

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
        setSearchQuery(''); // 장르 선택시 검색어 초기화
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setSelectedGenre('select'); // 검색시 장르 선택 초기화
    };

    // 정렬 토글 핸들러
    const handleSortToggle = (type) => {
        setSortConfig(prev => ({
            type: type,
            order: prev.type === type ? (prev.order === 'desc' ? 'asc' : 'desc') : 'desc'
        }));
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

    // 현재 표시할 데이터 결정
    const getCurrentData = () => {
        if (debouncedQuery) return searchData;
        if (selectedGenre === 'select') return topRatedData;
        return genreData;
    };

    const currentData = getCurrentData();

    return (
        <div>
            <div className="headbar"></div>
            <div className="controls-container">
                {/* 검색창 추가 */}
                <div className="search-container">
                    <SearchIcon size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="영화 제목을 검색하세요..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>

                <form id="genreForm">
                    <label htmlFor="genre">장르</label>
                    <select 
                        name="genre" 
                        id="genre" 
                        value={selectedGenre}
                        onChange={handleGenreChange}
                        disabled={!!searchQuery}
                    >
                        <option value="select">영화 장르 선택</option>
                        <option value="28">액션</option>
                        <option value="12">어드밴처</option>
                        <option value="16">애니메이션</option>
                        <option value="35">코미디</option>
                        <option value="80">범죄</option>
                    </select>
                </form>
                
                {selectedGenre !== 'select' && !searchQuery && (
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
                {(hasNextSearch || hasNextTopRated || hasNextGenre) && 
                    <h1>Loading...</h1>
                }
            </div>

            <button
                className="scroll-to-top"
                onClick={scrollToTop}
            >
                <ArrowUp />
            </button>
        </div>
    );
}

export default Search;