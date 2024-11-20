import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {  // onLoginSuccess prop 추가
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // 이메일 유효성 검사 함수
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  //컴포넌트 진입시
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser'); //로컬에서 현재 유저가 누군지 찾는다
    if (currentUser) {//현재 유저가 있으면
      setIsLoggedIn(true);//로그인 여부 true
      onLoginSuccess(JSON.parse(currentUser));  // 부모 컴포넌트(App)에서 전달받은 onLoginSuccess 함수를 호출하여 부모에게도 사용자 정보를 전달.
      navigate(from, { replace: true });//리다이렉트 관련 함수
    }
    else{//현재 유저가 없으면 currentUser는 공란으로
      localStorage.setItem('currentUser',"");
    }
  }, [navigate, from, onLoginSuccess]);  // onLoginSuccess 의존성 추가

  //로그인 버튼 눌렀을때
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');//로컬스토리지에 유저정보담긴 users라는 배열을 가져온다
    //없으면 [] 라는 빈 배열이라도 가져온다
    
    //비밀번호, 아이디 검증하기 users 배열에서 입력한 아이디와 비밀번호와 일치하는거 있는지 찾는다
    const user = users.find(u => 
      u.email === loginForm.email && 
      u.password === loginForm.password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setIsLoggedIn(true);
      onLoginSuccess(user);  // 로그인 성공 시 콜백 호출
      navigate(from, { replace: true });
    } else {
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: ''
    };

    // 이메일 검증
    if (!validateEmail(registerForm.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
      isValid = false;
    }

    // 비밀번호 검증
    if (!validatePassword(registerForm.password)) {
      newErrors.password = '비밀번호는 최소 8자리이며, 문자와 숫자를 포함해야 합니다.';
      isValid = false;
    }

    // 비밀번호 확인 검증
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

    if (!registerForm.termsAgreed) {
      alert('약관에 동의해주세요.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 이메일 중복 체크
    if (users.some(user => user.email === registerForm.email)) {
      alert('이미 존재하는 이메일입니다.');
      return;
    }

    // 새 사용자 추가
    const newUser = {
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      email: registerForm.email,
      password: registerForm.password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('회원가입이 완료되었습니다! 로그인해주세요.');
    setIsFlipped(false);
    setRegisterForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAgreed: false
    });
    setErrors({
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
    alert('로그아웃되었습니다.');
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 실시간 유효성 검사
    if (name === 'email' && value) {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value) ? '' : '올바른 이메일 형식이 아닙니다.'
      }));
    }
    
    if (name === 'password' && value) {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(value) ? '' : '비밀번호는 최소 8자리이며, 문자와 숫자를 포함해야 합니다.'
      }));
    }

    if (name === 'confirmPassword' && value) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value === registerForm.password ? '' : '비밀번호가 일치하지 않습니다.'
      }));
    }
  };

  const styles = {
    wrapper: {
      height: '500px',
      width: '320px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      perspective: '1000px',
      backdropFilter: 'blur(5px)',
    },
    cardContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      transformStyle: 'preserve-3d',
      transition: 'transform 0.8s ease-in-out',
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    },
    card: {
      position: 'absolute',
      width: '100%',
      height: '340px',
      padding: '40px 20px',
      textAlign: 'center',
      background: 'rgba(212, 0, 255, 0.26)',
      color: '#fff',
      borderRadius: '10px',
      backfaceVisibility: 'hidden',
      border: '1px solid #40175815',
      WebkitBackfaceVisibility: 'hidden',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(8.5px)',
    },
    loginCard: {
      transform: 'rotateY(0deg)',
    },
    registerCard: {
      transform: 'rotateY(180deg)',
      height: '500px',
    },
    title: {
      marginBottom: '20px',
      marginTop: '-10px',
      fontWeight: 600,
      fontSize: '24px',
      letterSpacing: '1px',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '5px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      outline: 'none',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      '&:focus': {
        border: '1px solid rgba(255, 255, 255, 0.5)',
        background: 'rgba(255, 255, 255, 0.15)',
      },
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
    termsContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      padding: '0 10px',
    },
    checkbox: {
      marginRight: '8px',
      cursor: 'pointer',
      width: '16px',
      height: '16px',
    },
    termsLabel: {
      fontSize: '12px',
      color: '#fff',
      textAlign: 'left',
      lineHeight: '1.4',
    },
    termsLink: {
      color: '#dfeaf7',
      textDecoration: 'underline',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      '&:hover': {
        color: '#fff',
      },
    },
    button: {
      padding: '12px 20px',
      width: '100%',
      backgroundColor: '#dfeaf7',
      border: 'none',
      textTransform: 'uppercase',
      fontWeight: 600,
      color: '#000',
      borderRadius: '5px',
      cursor: 'pointer',
      letterSpacing: '1px',
      marginBottom: '10px',
      marginTop: '20px',
      transition: 'all 0.3s ease',
      opacity: (props) => props.disabled ? 0.5 : 1,
      '&:hover': {
        backgroundColor: '#fff',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
    toggleText: {
      fontSize: '12px',
      letterSpacing: '1px',
      fontWeight: 300,
      marginTop: '15px',
    },
    toggle: {
      color: '#050506',
      cursor: 'pointer',
      fontWeight: 600,
      letterSpacing: 0,
      textDecoration: 'none',
      transition: 'color 0.3s ease',
      '&:hover': {
        color: '#fff',
      },
    },
    background: {
      background: `url('/api/placeholder/1920/1080') no-repeat center center fixed`,
      backgroundSize: 'cover',
      width: '100%',
      height: '100vh',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
      },
    },
    // 새로운 로그인 상태 관련 스타일
    loggedInContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      color: '#fff',
      background: 'rgba(212, 0, 255, 0.26)',
      padding: '40px',
      borderRadius: '10px',
      border: '1px solid #40175815',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(8.5px)',
      width: '320px',
    },
    welcomeTitle: {
      fontSize: '28px',
      fontWeight: 600,
      marginBottom: '20px',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    },
    userInfo: {
      fontSize: '16px',
      marginBottom: '10px',
      opacity: 0.9,
    },
    userEmail: {
      fontSize: '14px',
      opacity: 0.8,
      marginBottom: '25px',
    },
    logoutButton: {
      padding: '12px 30px',
      backgroundColor: '#dfeaf7',
      border: 'none',
      fontWeight: 600,
      color: '#000',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '14px',
      letterSpacing: '1px',
      '&:hover': {
        backgroundColor: '#fff',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
    errorMessage: {
      color: '#ff6b6b',
      fontSize: '12px',
      marginTop: '5px',
      textAlign: 'left',
      paddingLeft: '5px',
    },
  };

  if (isLoggedIn) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return (
      <div style={styles.background}>
        <div style={styles.loggedInContainer}>
          <h2 style={styles.welcomeTitle}>환영합니다!</h2>
          <p style={styles.userInfo}>{currentUser.firstName} {currentUser.lastName}님</p>
          <p style={styles.userEmail}>{currentUser.email}</p>
          <button 
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.background}>
      <div style={styles.wrapper}>
        <div style={styles.cardContainer}>
          {/* 로그인 카드 */}
          <div style={{ ...styles.card, ...styles.loginCard }}>
            <form onSubmit={handleLoginSubmit}>
              <h2 style={styles.title}>Login</h2>
              
              <div style={styles.inputGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.inputGroup}>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  style={styles.input}
                  required
                />
              </div>
              
              <button type="submit" style={styles.button}>
                Login
              </button>
              
              <p style={styles.toggleText}>
                Don't have an account?{' '}
                <span
                  onClick={() => setIsFlipped(true)}
                  style={styles.toggle}
                >
                  Register Now
                </span>
              </p>
            </form>
          </div>

          {/* 회원가입 카드 */}
          <div style={{ ...styles.card, ...styles.registerCard }}>
            <form onSubmit={handleRegisterSubmit}>
              <h2 style={styles.title}>Registration</h2>
              
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={registerForm.firstName}
                  onChange={handleRegisterChange}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={registerForm.lastName}
                  onChange={handleRegisterChange}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.inputGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  style={styles.input}
                  required
                />
                {errors.email && <p style={styles.errorMessage}>{errors.email}</p>}
              </div>
              
              <div style={styles.inputGroup}>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  style={styles.input}
                  required
                />
                {errors.password && <p style={styles.errorMessage}>{errors.password}</p>}
              </div>

              <div style={styles.inputGroup}>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  style={styles.input}
                  required
                />
                {errors.confirmPassword && <p style={styles.errorMessage}>{errors.confirmPassword}</p>}
              </div>

              <div style={styles.termsContainer}>
                <input
                  type="checkbox"
                  name="termsAgreed"
                  checked={registerForm.termsAgreed}
                  onChange={handleRegisterChange}
                  style={styles.checkbox}
                />
                <label style={styles.termsLabel}>
                  필수약관에 동의합니다.{' '}
                </label>
              </div>
              
              <button 
                type="submit" 
                style={{
                  ...styles.button,
                  opacity: registerForm.termsAgreed ? 1 : 0.5,
                  cursor: registerForm.termsAgreed ? 'pointer' : 'not-allowed'
                }}
                disabled={!registerForm.termsAgreed}
              >
                Register
              </button>
              
              <p style={styles.toggleText}>
                Already have an account?{' '}
                <span
                  onClick={() => setIsFlipped(false)}
                  style={styles.toggle}
                >
                  Login Now
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;