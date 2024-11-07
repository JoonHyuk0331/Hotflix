import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import HotflixLogo from './img/HotflixLogo.jpg'; // 이미지 경로를 import
import Movie from './components/Movie';


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
  const [now_playing_movies, set_now_playing_Movies] = useState([]);
  const [popular_movies, set_popular_Movies] = useState([]);
  const [toprated_movies, set_toprated_Movies] = useState([]);
  const [upcomming_movies, set_upcoming_Movies] = useState([]);

  //set_now_playing_Movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=ko&page=1&region=KR&api_key=8cc1274fb9b4939dd84d9741f37e166e`);
        const data = await response.json();
        console.log(data);
        set_now_playing_Movies(data.results); // 영화 목록 중 4개 항목만 가져오기 data.results.slice(0, 4)
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, []);
  //set_popular_Movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=ko&page=1&region=KR&api_key=8cc1274fb9b4939dd84d9741f37e166e`);
        const data = await response.json();
        console.log(data);
        set_popular_Movies(data.results); // 영화 목록 중 4개 항목만 가져오기 data.results.slice(0, 4)
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, []);
  //set_toprated_Movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=ko&page=1&region=KR&api_key=8cc1274fb9b4939dd84d9741f37e166e`);
        const data = await response.json();
        console.log(data);
        set_toprated_Movies(data.results); // 영화 목록 중 4개 항목만 가져오기 data.results.slice(0, 4)
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, []);
  //set_upcoming_Movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?language=ko&page=1&region=KR&api_key=8cc1274fb9b4939dd84d9741f37e166e`);
        const data = await response.json();
        console.log(data);
        set_upcoming_Movies(data.results); // 영화 목록 중 4개 항목만 가져오기 data.results.slice(0, 4)
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <main>
    
      <h1>현재 상영중 영화</h1>
      <div className="movies-container">
        {
          now_playing_movies.map((movie)=>{
            return(
              <Movie key={movie.id} movie={movie} />
            )
          })
        }
      </div>
      <h1>인기있는 영화</h1>
      <div className="movies-container">
        {
          popular_movies.map((movie)=>{
            return(
              <Movie key={movie.id} movie={movie} />
            )
          })
        }
      </div>
      <h1>평점이 높은 영화</h1>
      <div className="movies-container">
        {
          toprated_movies.map((movie)=>{
            return(
              <Movie key={movie.id} movie={movie} />
            )
          })
        }
      </div>
      <h1>개봉 예정 영화</h1>
      <div className="movies-container">
        {
          upcomming_movies.map((movie)=>{
            return(
              <Movie key={movie.id} movie={movie} />
            )
          })
        }
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
