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

  const formatDate = (dateStr) => {
    if (!dateStr) return '미정';
    return dateStr.split('-').slice(0, 2).join('.');
  };

  return (
    <div 
        key={movie.id}
        className="grid-item"
        onClick={handleMovieClick}
    >
      <img 
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
        alt={movie.title}
        className="poster"
      />
      <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-stats">
              <span className="rating">
                  ⭐ {movie.vote_average.toFixed(1)}
                  <span className="vote-count">({movie.vote_count}명)</span>
              </span>
              <span className="release-date">
                  {formatDate(movie.release_date)}
              </span>
          </div>
      </div>
    </div>
  );
}