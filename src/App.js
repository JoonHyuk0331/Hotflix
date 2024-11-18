import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import HotflixLogo from './img/HotflixLogo.jpg';
import Main from './components/Main';
import Popular from './components/Popular';
import Search from './components/Search';
import Login from './components/Login';
import useGetTopRatedMovies from './hooks/useGetTopRatedMovies';
import Wishlist from './components/Wishlist';
import { useRef } from 'react';

// ProtectedRoute 컴포넌트
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('currentUser');
  const location = useLocation();

  if (!isAuthenticated) {
    // 현재 시도하려던 경로를 state로 전달
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// 헤더 컴포넌트
const Header = ({ isLoggedIn, username, onLogout }) => {
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHeaderOpacity(1 - scrollTop / 200);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    onLogout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header style={{ opacity: headerOpacity }} className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={HotflixLogo} alt="Home Logo" />
        </Link>
        
        <nav className="nav-links">
          <Link to="/popular">인기 콘텐츠</Link>
          <Link to="/search">찾기</Link>
          <Link to="/wishlist">위시리스트</Link>
        </nav>

        <div className="auth" ref={userMenuRef}>
          {isLoggedIn ? (
            <div className="user-profile">
              <button
                onClick={toggleUserMenu}
                className="profile-button"
              >
                <div className="avatar">
                  {username.charAt(0)}
                </div>
                <span>{username}</span>
              </button>

              {isUserMenuOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="login-status">로그인됨</div>
                    <div className="username">{username}</div>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="logout-button"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-button">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

// App 컴포넌트
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setIsLoggedIn(true);
      setUsername(`${user.firstName} ${user.lastName}`);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setUsername("");
  };

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUsername(`${user.firstName} ${user.lastName}`);
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage
  } = useGetTopRatedMovies();

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <div className='main-content'></div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={
          <Login onLoginSuccess={handleLoginSuccess} />
        } />
        {/* 보호된 라우트들 */}
        <Route path="/popular" element={
          <ProtectedRoute>
            <Popular />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

export default App;