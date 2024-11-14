import React from "react";

export default function Movie({ movie }) {
  // 클릭 이벤트 핸들러
  const handleMovieClick = () => {
    try {
      // 현재 영화 ID를 로컬 스토리지에 저장
      localStorage.setItem('selectedMovieId', movie.id.toString());
      console.log(`영화 ID ${movie.id}가 로컬 스토리지에 저장되었습니다.`);
      
      // 선택적: 이전에 저장된 영화 ID들의 기록을 유지하고 싶다면
      const previousMovies = JSON.parse(localStorage.getItem('viewedMovies') || '[]');
      if (!previousMovies.includes(movie.id)) {
        previousMovies.push(movie.id);
        localStorage.setItem('viewedMovies', JSON.stringify(previousMovies));
      }
    } catch (error) {
      console.error('로컬 스토리지 저장 중 오류 발생:', error);
    }
  };

  return (
    <div className="movies-container">
      <div 
        className="movie-card cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleMovieClick}
      >
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title}
        />
        <h4>{movie.title}</h4>
        <span>평점: {movie.vote_average}</span>
      </div>
    </div>
  );
}