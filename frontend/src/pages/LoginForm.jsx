import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  LockOutlined,
  Person,
  School,
  SupervisorAccount,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import backgroundImage from '../assets/images/background_Loginpage.png';

import { endpoints } from '../services/api';
import PageTitle from '../components/PageTitle';

const LoginForm = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleInfo = {
    admin: {
      title: 'Administrator',
      eyebrow: 'Administration Portal',
      description: 'Manage academic data, users and institutional performance.',
      icon: <SupervisorAccount sx={{ fontSize: 38 }} />,
      accent: '#10cfc9',
      redirectPath: '/admin/dashboard',
    },
    teacher: {
      title: 'Teacher',
      eyebrow: 'Teaching Portal',
      description: 'Monitor classes, manage results and support student progress.',
      icon: <School sx={{ fontSize: 38 }} />,
      accent: '#526df5',
      redirectPath: '/teacher/dashboard',
    },
    student: {
      title: 'Student',
      eyebrow: 'Student Portal',
      description: 'Track your grades, insights and personalized recommendations.',
      icon: <Person sx={{ fontSize: 38 }} />,
      accent: '#f5a524',
      redirectPath: '/student/dashboard',
    },
  };

  useEffect(() => {
    if (!roleInfo[role]) {
      navigate('/login');
      return;
    }

    const savedUsername = localStorage.getItem('username');
    const savedRole = localStorage.getItem('userRole');

    if (savedUsername && savedRole === role) {
      setFormData((prev) => ({
        ...prev,
        username: savedUsername,
        rememberMe: true,
      }));
    }
  }, [role, navigate]);

  if (!roleInfo[role]) {
    return null;
  }

  const currentRole = roleInfo[role];

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(endpoints.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        sessionStorage.setItem('currentUser', JSON.stringify(data.user));

        if (formData.rememberMe) {
          localStorage.setItem('username', formData.username);
          localStorage.setItem('userRole', role);
        } else {
          localStorage.removeItem('username');
          localStorage.removeItem('userRole');
        }

        navigate(currentRole.redirectPath);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(135deg, rgba(5, 27, 50, 0.94), rgba(5, 27, 50, 0.78)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <PageTitle
        title={`Student Performance Prediction System - ${currentRole.title} Portal`}
        description="Sign in to your academic portal."
      />

      <Box
        sx={{
          position: 'absolute',
          width: 380,
          height: 380,
          borderRadius: '50%',
          right: { xs: -270, md: -120 },
          bottom: { xs: -250, md: -180 },
          background: `radial-gradient(circle, ${currentRole.accent}38 0%, ${currentRole.accent}00 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 5 } }}>
        <Box sx={{ mb: 3 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Stack direction="row" alignItems="center" spacing={1.2}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  bgcolor: 'rgba(16,207,201,0.16)',
                  border: '1px solid rgba(16,207,201,0.38)',
                  color: '#56e0da',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <School />
              </Box>
              <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.25rem' }}>
                Academic Portal
              </Typography>
            </Stack>
          </Link>
        </Box>

        <Paper
          elevation={0}
          sx={{
            overflow: 'hidden',
            borderRadius: { xs: '20px', md: '28px' },
            border: '1px solid rgba(255,255,255,0.7)',
            bgcolor: 'rgba(255,255,255,0.96)',
            boxShadow: '0 24px 70px rgba(3,19,38,0.32)',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '0.82fr 1.18fr' },
              minHeight: 560,
            }}
          >
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 5,
                color: 'white',
                background: 'linear-gradient(145deg, #071d35 0%, #0b3154 100%)',
              }}
            >
              <Box>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '20px',
                    mb: 3,
                    bgcolor: `${currentRole.accent}20`,
                    border: `1px solid ${currentRole.accent}55`,
                    color: currentRole.accent,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {currentRole.icon}
                </Box>
                <Typography sx={{ color: currentRole.accent, fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', mb: 1 }}>
                  {currentRole.eyebrow}
                </Typography>
                <Typography component="h1" sx={{ fontWeight: 800, fontSize: '2.2rem', lineHeight: 1.12, letterSpacing: '-0.035em', mb: 2 }}>
                  Welcome back
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.75 }}>
                  {currentRole.description}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ pt: 4 }}>
                <LockOutlined sx={{ color: currentRole.accent, fontSize: 20 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.68)', fontSize: '0.82rem', fontWeight: 600 }}>
                  Secure institutional access
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ p: { xs: 3, sm: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: { xs: 'grid', md: 'none' },
                    placeItems: 'center',
                    width: 58,
                    height: 58,
                    borderRadius: '16px',
                    mb: 2,
                    bgcolor: `${currentRole.accent}16`,
                    color: currentRole.accent,
                  }}
                >
                  {currentRole.icon}
                </Box>
                <Typography component="h2" sx={{ color: '#071d35', fontWeight: 800, fontSize: { xs: '1.65rem', sm: '2rem' }, mb: 0.75 }}>
                  Sign in
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
                  Continue as {currentRole.title.toLowerCase()}
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px' }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  required
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                  sx={{ mb: 2.25 }}
                />

                <TextField
                  fullWidth
                  required
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{ mb: 1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={handleTogglePassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        sx={{ color: 'text.disabled', '&.Mui-checked': { color: currentRole.accent } }}
                      />
                    }
                    label="Remember me"
                    sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary', fontSize: '0.88rem' } }}
                  />
                </Stack>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  disabled={loading}
                  sx={{
                    minHeight: 52,
                    borderRadius: '11px',
                    bgcolor: '#071d35',
                    color: 'white',
                    fontWeight: 800,
                    boxShadow: 'none',
                    justifyContent: 'space-between',
                    px: 2.5,
                    '&:hover': { bgcolor: currentRole.accent, boxShadow: `0 10px 24px ${currentRole.accent}35` },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <Button
                  component={Link}
                  to="/login"
                  startIcon={<ArrowBack />}
                  sx={{ mt: 2, color: 'text.secondary', fontWeight: 700 }}
                >
                  Back to role selection
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Typography
          align="center"
          sx={{ mt: 2.5, color: 'rgba(255,255,255,0.78)', fontWeight: 600, fontSize: '0.78rem' }}
        >
          Group 6B · Student Performance Prediction System
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginForm;
