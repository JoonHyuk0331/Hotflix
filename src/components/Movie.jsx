import React, { useState, useEffect } from 'react';

export default function Movie({ movie }) {

  const [isHighlighted, setIsHighlighted] = useState(false); // 하이라이트 상태

  // 현재 로그인된 사용자 정보 가져오기
  const getCurrentUser = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    return currentUser?.email || "";
  };

  // 사용자별 영화 리스트에서 하이라이트 상태를 초기화
  useEffect(() => {
    const userEmail = getCurrentUser();
    if (!userEmail) return;

    const userMoviesKey = `viewedMovies_${userEmail}`;
    const savedMovies = JSON.parse(localStorage.getItem(userMoviesKey) || "[]");

    // 영화가 리스트에 있는 경우 하이라이트 상태 활성화
    setIsHighlighted(savedMovies.includes(movie.id));
  }, [movie.id]);
  // 클릭 이벤트 핸들러
  const handleMovieClick = () => {
    try {
      const userEmail = getCurrentUser();

      if (!userEmail) {
        console.warn("로그인된 사용자가 없습니다.");
        return;
      }

      const userMoviesKey = `viewedMovies_${userEmail}`;
      const previousMovies = JSON.parse(localStorage.getItem(userMoviesKey) || "[]");

      let updatedMovies;
      if (previousMovies.includes(movie.id)) {
        // 영화 ID가 이미 있다면 제거
        updatedMovies = previousMovies.filter((id) => id !== movie.id);
        console.log(`영화 ID ${movie.id}가 ${userEmail}의 리스트에서 제거되었습니다.`);
      } else {
        // 영화 ID가 없다면 추가
        updatedMovies = [...previousMovies, movie.id];
        console.log(`영화 ID ${movie.id}가 ${userEmail}의 리스트에 추가되었습니다.`);
      }

      localStorage.setItem(userMoviesKey, JSON.stringify(updatedMovies));
      setIsHighlighted(!isHighlighted); // 하이라이트 상태 토글
    } catch (error) {
      console.error("로컬 스토리지 저장 중 오류 발생:", error);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '미정';
    return dateStr.split('-').slice(0, 2).join('.');
  };

  return (
    <div
      key={movie.id}
      className={`grid-item ${isHighlighted ? "highlighted" : ""}`} // 하이라이트 클래스 추가
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
          <span className="release-date">{formatDate(movie.release_date)}</span>
        </div>
      </div>
    </div>
  );
}