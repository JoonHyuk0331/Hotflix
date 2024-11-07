import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import HotflixLogo from './img/HotflixLogo.jpg'; // 이미지 경로를 import

// 헤더 컴포넌트
const Header = ({ isLoggedIn, username, onLogout }) => {
  const [headerOpacity, setHeaderOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHeaderOpacity(1 - scrollTop / 200); // 스크롤에 따라 헤더 투명도 변경
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{ opacity: headerOpacity }}>
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={HotflixLogo} alt="Home Logo" style={{ height: '40px' }} /> {/* 로고 이미지 삽입 */}
        </Link>
        <nav>
          <Link to="/popular">인기 콘텐츠</Link>
          <Link to="/search">찾기</Link>
          <Link to="/wishlist">위시리스트</Link>
        </nav>
        <div className="auth">
          {isLoggedIn ? (
            <>
              <span>{username}</span>
              <button onClick={onLogout}>로그아웃</button>
            </>
          ) : (
            <Link to="/login">로그인</Link>
          )}
        </div>
      </div>
    </header>
  );
};

// 메인 화면 컴포넌트
const Main = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=8cc1274fb9b4939dd84d9741f37e166e`);
        const data = await response.json();
        setMovies(data.results.slice(0, 4)); // 영화 목록 중 4개 항목만 가져오기
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <main>
      <h1>Popular Movies</h1>
      <div className="movies-container">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <h2>{movie.title}</h2>
          </div>
        ))}
      </div>
    </main>
  );
};

// App 컴포넌트 (메인 레이아웃 포함)
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const username = "User123";

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <Main />
    </div>
  );
};

export default App;
