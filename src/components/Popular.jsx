import React, { useState, useEffect, useRef } from 'react';
import Movie from './Movie';
import { ArrowUp, Loader2 } from "lucide-react";
import '../App.css';

const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [totalPages, setTotalPages] = useState(1);
  const [apiKey, setApiKey] = useState(""); // API 키 상태 추가
  const loader = useRef(null);

  
  // 로그인된 사용자의 비밀번호(API 키)를 가져오기
  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // currentUser의 email과 동일한 email을 가진 객체 찾기
      const matchedUser = users.find(user => user.email === currentUser.email);
      if (matchedUser) {
        setApiKey(matchedUser.password); // API 키로 사용
        console.log("API 키를 설정했습니다:", matchedUser.password);
      } else {
        console.log("일치하는 사용자가 없습니다.");
      }
    } catch (error) {
      console.error("로그인된 사용자의 이메일로부터 API 키 가져오기 실패:", error);
    }
  }, []);

  // 한 페이지에 보여줄 영화 수 계산
  const calculateMoviesPerPage = () => {
    const viewportHeight = window.innerHeight - 200; // 버튼과 페이지네이션 공간 제외
    const movieHeight = 400; // 예상되는 영화 카드의 높이
    const columns = window.innerWidth >= 1200 ? 4 : 
                   window.innerWidth >= 768 ? 3 : 
                   window.innerWidth >= 480 ? 2 : 1;
    const rows = Math.floor(viewportHeight / movieHeight);
    return rows * columns;
  };

  const [moviesPerPage] = useState(calculateMoviesPerPage());

  // 영화 데이터 가져오기
  const fetchMovies = async (page, shouldAppend = false) => {
    if (!apiKey) {
      console.error("API 키가 설정되지 않았습니다. fetch 요청을 중단합니다.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`
      );
      const data = await response.json();
  
      if (shouldAppend) {
        setMovies(prev => [...prev, ...data.results]);
      } else {
        setMovies(viewMode === 'table' ? 
          data.results.slice(0, moviesPerPage) : 
          data.results
        );
      }
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setLoading(false);
  };

  // 무한 스크롤 처리
  useEffect(() => {
    if (viewMode !== 'infinite') return;

    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        setCurrentPage(prev => prev + 1);
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0
    });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [loading, viewMode, apiKey]);

  // 페이지 변경시 데이터 가져오기
  useEffect(() => {
    if (viewMode === 'table') {
      fetchMovies(currentPage, false);
    } else {
      fetchMovies(currentPage, true);
    }
  }, [currentPage, viewMode, apiKey]);

  // 뷰 모드 변경 처리
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setCurrentPage(1);
    setMovies([]);
  };

  // 페이지네이션 처리
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      {/* 뷰 모드 선택 버튼 */}
      <div className="view-mode-buttons">
        <button
          className={`view-mode-button ${viewMode === 'table' ? 'active' : ''}`}
          onClick={() => handleViewModeChange('table')}
        >
          Table View
        </button>
        <button
          className={`view-mode-button ${viewMode === 'infinite' ? 'active' : ''}`}
          onClick={() => handleViewModeChange('infinite')}
        >
          Infinite Scroll
        </button>
      </div>

      {/* 영화 그리드 */}
      {viewMode === 'table' ? (
        <div className="table-view-container">
          <div className="table-view">
            {movies.map((movie) => (
              <Movie key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      ) : (
        <div className="infinite-view">
          {movies.map((movie) => (
            <Movie key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* 로딩 표시 */}
      {loading && (
        <div className="loading">
          <Loader2 className="loading-spinner" />
        </div>
      )}

      {/* 무한 스크롤 로더 */}
      {viewMode === 'infinite' && <div ref={loader} style={{ height: '40px' }} />}

      {/* 페이지네이션 (테이블 뷰일 때만) */}
      {viewMode === 'table' && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}

      {/* 맨 위로 가기 버튼 (무한 스크롤일 때만) */}
      {viewMode === 'infinite' && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
        >
          <ArrowUp />
        </button>
      )}
    </div>
  );
};

export default Popular;