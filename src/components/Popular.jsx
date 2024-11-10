// Popular.js
import React, { useState, useEffect } from "react";
import MovieSe from './MovieSe';
import '../App.css';

function Popular() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const moviesPerPage = 9; // 한 페이지에 표시할 영화 수

  useEffect(() => {
    // Popular 컴포넌트가 마운트되면 body의 overflow를 hidden으로 설정
    document.body.style.overflow = 'hidden';

    // 컴포넌트 언마운트 시 overflow 스타일을 되돌림
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=8cc1274fb9b4939dd84d9741f37e166e&language=ko-KR&page=${currentPage}`
        );
        const data = await response.json();
        setMovies(data.results.slice(0, moviesPerPage));
        setTotalPages(Math.ceil(data.total_results / moviesPerPage));
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="popular-container">
      <h2>인기 콘텐츠</h2>
      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieSe key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="pagination-buttons">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          이전 페이지
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          다음 페이지
        </button>
      </div>
    </div>
  );
}

export default Popular;
