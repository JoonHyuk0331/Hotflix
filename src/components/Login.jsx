import React, { useState } from 'react';

const Login = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    termsAgreed: false
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', loginForm);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerForm.termsAgreed) {
      alert('약관에 동의해주세요.');
      return;
    }
    console.log('Register submitted:', registerForm);
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
  };

  const styles = {
    wrapper: {
      height: '500px', // 높이 증가
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
    },
    loginCard: {
      transform: 'rotateY(0deg)',
    },
    registerCard: {
      transform: 'rotateY(180deg)',
      height: '500px', // 높이 증가
    },
    title: {
      marginBottom: '20px',
      marginTop: '-10px',
      fontWeight: 600,
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      outline: 'none',
    },
    termsContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      padding: '0 10px',
    },
    checkbox: {
      marginRight: '8px',
    },
    termsLabel: {
      fontSize: '12px',
      color: '#fff',
      textAlign: 'left',
    },
    termsLink: {
      color: '#dfeaf7',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    button: {
      padding: '10px 20px',
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
      opacity: (props) => props.disabled ? 0.5 : 1,
    },
    toggleText: {
      fontSize: '12px',
      letterSpacing: '1px',
      fontWeight: 300,
    },
    toggle: {
      color: '#050506',
      cursor: 'pointer',
      fontWeight: 600,
      letterSpacing: 0,
      textDecoration: 'none',
    },
    background: {
      background: `url('/api/placeholder/1920/1080') no-repeat center center fixed`,
      backgroundSize: 'cover',
      width: '100%',
      height: '100vh',
      position: 'relative',
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.wrapper}>
        <div style={styles.cardContainer}>
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
                />
              </div>
              
              <div style={styles.inputGroup}>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  style={styles.input}
                />
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