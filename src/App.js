import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import HotflixLogo from './img/HotflixLogo.jpg';
import Main from './components/Main.jsx';
import Popular from './components/Popular.jsx';
import Search from './components/Search.jsx';
import Login from './components/Login.jsx';
import useGetTopRatedMovies from './hooks/useGetTopRatedMovies.jsx';
import Wishlist from './components/Wishlist.jsx';
import { useRef } from 'react';
import axios from 'axios';

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('currentUser');
  const location = useLocation();

  if (!isAuthenticated) {
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

// 카카오 리디렉션 컴포넌트
const KakaoRedirect = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKakaoToken = async () => {
      try {
        const code = new URL(window.location.href).searchParams.get("code");
        if (!code) {
          throw new Error('인증 코드가 없습니다.');
        }

        const grant_type = 'authorization_code';
        const client_id = process.env.REACT_APP_REST_API_KEY;

        // 카카오 토큰 요청
        const tokenResponse = await axios.post(
          `https://kauth.kakao.com/oauth/token?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&code=${code}`,
          {},
          {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
          }
        );

        const accessToken = tokenResponse.data.access_token;

        // 사용자 정보 요청
        const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const kakaoAccount = userInfoResponse.data.kakao_account;
        const profile = kakaoAccount.profile;

        // 카카오 사용자 정보로 로컬 사용자 생성 또는 로그인
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        let user = users.find(u => u.email === kakaoAccount.email);

        if (!user) {
          // 새 사용자 생성
          user = {
            firstName: profile.nickname.split(' ')[0] || '',
            lastName: profile.nickname.split(' ')[1] || '',
            email: kakaoAccount.email,
            password: '', // 소셜 로그인은 비밀번호 없음
            provider: 'kakao'
          };

          users.push(user);
          localStorage.setItem('users', JSON.stringify(users));
        }

        // 로컬 스토리지에 사용자 저장
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // 로그인 성공 처리
        onLoginSuccess(user);
        navigate('/', { replace: true });

      } catch (error) {
        console.error('카카오 로그인 오류:', error);
        alert('로그인 중 오류가 발생했습니다.');
        navigate('/login');
      }
    };

    fetchKakaoToken();
  }, [navigate, onLoginSuccess]);

  return <div>로그인 중입니다...</div>;
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
    else {
      localStorage.setItem('currentUser', "")
    }
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.setItem('currentUser', "");
    setIsLoggedIn(false);
    setUsername("");
  };

  // 로그인 성공 핸들러
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
        <Route path="/oauth" element={<KakaoRedirect onLoginSuccess={handleLoginSuccess} />} />
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