import { Button, Container, TextField } from '@mui/material';
import { fetchPostData } from 'client/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AuthLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    if (isLoggedIn) {
      navigate('/');
      window.location.reload();
    }
  });

  const validateEmail = (email) => {
    // basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }; // search regular expression for email validation
  const validatePassword = (password) => {
    // password validation
    return password.length >= 6 && password.length <= 25;
  };

  const handleLogin = async () => {
    setErrors({ email: '', password: '' });

    if (!validateEmail(email)) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Invalid email format' }));
      return;
    }

    if (!validatePassword(password)) {
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Password must be at least 6 characters' }));
      return;
    }
    // Add your login logic here
    fetchPostData('/auth/token', { email, password })
      .then((response) => {
        const { token } = response.data;
        setLoginError('');
        localStorage.setItem('token', token);
        navigate('/');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Login error', error);
        setLoginError('An error occurred during login');
      });
  };

  return (
    <Container componet="main" maxWidth="xs">
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
        Login
      </Button>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
    </Container>
  );
};

export default AuthLogin;
