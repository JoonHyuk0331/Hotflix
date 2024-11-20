import React, { useState, useEffect } from "react";
import useGetTopRatedMovies from "../hooks/useGetTopRatedMovies";
import useGetMoviesByGenre from "../hooks/useGetMoviesByGenre";
import useSearchMovies from "../hooks/useSearchMovies";
import '../App.css';
import { useInView } from "react-intersection-observer";
import { ArrowUpDown, Search as SearchIcon, History } from 'lucide-react';
import Movie from "./Movie";
import { ArrowUp } from "lucide-react";

// 맨 위로 스크롤
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 현재 사용자의 이메일 가져오기
const getCurrentUserEmail = () => {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        return currentUser?.email || '';
    } catch (error) {
        console.error("사용자 정보 로드 중 오류 발생:", error);
        return '';
    }
};

// 검색 기록 저장
const saveSearchHistory = (email, searchQuery) => {
    if (!email || !searchQuery) return;
    
    try {
        const historyKey = `searchHistory_${email}`;
        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
        
        // 중복 검색어 제거 및 최신 검색어를 앞에 추가
        const updatedHistory = [
            searchQuery,
            ...existingHistory.filter(item => item !== searchQuery)
        ].slice(0, 10); // 최대 10개까지만 저장
        
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("검색 기록 저장 중 오류 발생:", error);
    }
};

// 검색 기록 로드
const loadSearchHistory = (email) => {
    if (!email) return [];
    
    try {
        const historyKey = `searchHistory_${email}`;
        return JSON.parse(localStorage.getItem(historyKey) || '[]');
    } catch (error) {
        console.error("검색 기록 로드 중 오류 발생:", error);
        return [];
    }
};

function Search() {
    const [selectedGenre, setSelectedGenre] = useState('select');
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        type: 'vote_average',
        order: 'desc'
    });
    const {ref, inView} = useInView();
    const userEmail = getCurrentUserEmail();

    // 컴포넌트 마운트 시 검색 기록 로드
    useEffect(() => {
        if (userEmail) {
            const history = loadSearchHistory(userEmail);
            setSearchHistory(history);
        }
    }, [userEmail]);

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
    } = useSearchMovies(searchQuery);

    useEffect(() => {
        if (inView) {
            if (searchQuery && hasNextSearch && !isFetchingNextSearch) {
                fetchNextSearch();
            } else if (selectedGenre === 'select' && hasNextTopRated && !isFetchingNextTopRated) {
                fetchNextTopRated();
            } else if (selectedGenre !== 'select' && hasNextGenre && !isFetchingNextGenre) {
                fetchNextGenre();
            }
        }
    }, [inView, selectedGenre, searchQuery]);

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
        setSearchInput('');
        setSearchQuery('');
        setShowHistory(false);
    };

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
        setShowHistory(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchInput.trim()) return;
        
        setSearchQuery(searchInput);
        setSelectedGenre('select');
        setShowHistory(false);
        
        // 검색 기록 저장
        if (userEmail) {
            saveSearchHistory(userEmail, searchInput.trim());
            setSearchHistory(loadSearchHistory(userEmail));
        }
    };

    // 검색 기록 클릭 처리
    const handleHistoryClick = (query) => {
        setSearchInput(query);
        setSearchQuery(query);
        setSelectedGenre('select');
        setShowHistory(false);
    };

    // 검색 기록 삭제
    const handleDeleteHistory = (queryToDelete) => {
        if (userEmail) {
            const updatedHistory = searchHistory.filter(query => query !== queryToDelete);
            localStorage.setItem(`searchHistory_${userEmail}`, JSON.stringify(updatedHistory));
            setSearchHistory(updatedHistory);
        }
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
        if (searchQuery) return searchData;
        if (selectedGenre === 'select') return topRatedData;
        return genreData;
    };

    const currentData = getCurrentData();

    return (
        <div>
            <div className="headbar"></div>
            <div className="controls-container">
                <form onSubmit={handleSearch} className="search-container">
                    <div className="search-input-container">
                        {/* <SearchIcon size={20} className="search-icon" /> */}
                        <input
                            type="text"
                            placeholder="영화 제목을 검색하세요..."
                            value={searchInput}
                            onChange={handleSearchInputChange}
                            onFocus={() => setShowHistory(true)}
                            className="search-input"
                        />
                        {/* 검색 기록 드롭다운 */}
                        {showHistory && searchHistory.length > 0 && (
                            <div className="search-history-dropdown">
                                {searchHistory.map((query, index) => (
                                    <div key={index} className="search-history-item">
                                        <div 
                                            className="history-query"
                                            onClick={() => handleHistoryClick(query)}
                                        >
                                            <History size={14} />
                                            <span>{query}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="delete-history"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteHistory(query);
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="submit" className="search-button">
                        검색
                    </button>
                </form>

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