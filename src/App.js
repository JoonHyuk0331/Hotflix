import React, { useState, useEffect } from 'react';
import { Link,Routes,Route } from 'react-router-dom';
import './App.css';
import HotflixLogo from './img/HotflixLogo.jpg'; // 이미지 경로를 import
import Main from './components/Main';
import Popular from './components/Popular';
import Search from './components/Search';
import useGetTopRatedMovies from './hooks/useGetTopRatedMovies';
import Wishlist from './components/Wishlist';


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

// App 컴포넌트 (메인 레이아웃 포함)
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const username = "User123";

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage
  }=useGetTopRatedMovies();

  console.log("dddd",data);

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      {/* <div className='main-content'></div> */}
      <Routes>
        <Route path="/" element={ <Main /> } />
        <Route path="/popular" element={ <Popular /> } />
        <Route path="/search" element={ <Search /> } />
        <Route path="/wishlist" element={ <Wishlist /> } />


      </Routes>
    </div>
  );
};

export default App;
