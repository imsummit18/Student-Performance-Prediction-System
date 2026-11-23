// @ts-nocheck
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Person,
  School,
  SupervisorAccount,
  VerifiedUser,
} from '@mui/icons-material';
import PageTitle from '../components/PageTitle';
import backgroundImage from '../assets/images/background_Loginpage.png';

const SelectionRole = () => {
  const roles = [
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Manage users, academic data and institutional settings.',
      icon: <SupervisorAccount sx={{ fontSize: 34 }} />,
      accent: '#10cfc9',
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Monitor classes, manage grades and identify students at risk.',
      icon: <School sx={{ fontSize: 34 }} />,
      accent: '#526df5',
    },
    {
      id: 'student',
      title: 'Student',
      description: 'View results, track progress and receive academic guidance.',
      icon: <Person sx={{ fontSize: 34 }} />,
      accent: '#f5a524',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `linear-gradient(135deg, rgba(5, 27, 50, 0.94), rgba(5, 27, 50, 0.76)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: { md: 'fixed', xs: 'scroll' },
      }}
    >
      <PageTitle
        title="Student Performance Prediction System - Role Selection"
        description="Select your role to sign in."
      />

      <Box
        sx={{
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          right: { xs: -310, md: -170 },
          top: { xs: -280, md: -220 },
          background: 'radial-gradient(circle, rgba(16,207,201,0.30) 0%, rgba(16,207,201,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: { xs: 4, md: 5 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: { xs: 3, md: 4 } }}
        >
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
              <Typography sx={{ color: 'white', fontWeight: 800, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                Academic Portal
              </Typography>
            </Stack>
          </Link>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <VerifiedUser sx={{ fontSize: 18, color: '#56e0da' }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.875rem', fontWeight: 600 }}>
              Secure institutional access
            </Typography>
          </Stack>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5, md: 5 },
            borderRadius: { xs: '20px', md: '28px' },
            border: '1px solid rgba(255,255,255,0.72)',
            bgcolor: 'rgba(255,255,255,0.94)',
            backdropFilter: 'blur(18px)',
            boxShadow: '0 24px 70px rgba(3,19,38,0.28)',
          }}
        >
          <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: { xs: 3, md: 4 } }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 1.5 }}>
              <Box sx={{ width: 34, height: 3, borderRadius: 2, bgcolor: 'primary.main' }} />
              <Typography sx={{ color: 'primary.main', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                EST Oujda · 2026/2027
              </Typography>
              <Box sx={{ width: 34, height: 3, borderRadius: 2, bgcolor: 'primary.main' }} />
            </Stack>

            <Typography
              component="h1"
              sx={{
                color: '#071d35',
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.6rem', md: '3.15rem' },
                lineHeight: 1.05,
                letterSpacing: '-0.045em',
                mb: 1.5,
              }}
            >
              Choose your <Box component="span" sx={{ color: 'primary.main' }}>portal</Box>
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.96rem', md: '1.05rem' }, lineHeight: 1.75 }}>
              Select the account role that matches your position to continue securely.
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {roles.map((role) => (
              <Grid item xs={12} md={4} key={role.id}>
                <Paper
                  component={Link}
                  to={`/login/${role.id}`}
                  elevation={0}
                  sx={{
                    height: '100%',
                    minHeight: { xs: 220, md: 250 },
                    p: { xs: 2.5, md: 3 },
                    borderRadius: '18px',
                    border: '1px solid rgba(7,29,53,0.09)',
                    bgcolor: 'white',
                    color: 'inherit',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: `${role.accent}70`,
                      boxShadow: `0 18px 38px ${role.accent}1A`,
                    },
                    '&:hover .role-arrow': {
                      bgcolor: role.accent,
                      color: 'white',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: '16px',
                      bgcolor: `${role.accent}16`,
                      color: role.accent,
                      display: 'grid',
                      placeItems: 'center',
                      mb: 2,
                    }}
                  >
                    {role.icon}
                  </Box>

                  <Typography component="h2" sx={{ color: '#071d35', fontWeight: 800, fontSize: '1.25rem', mb: 0.75 }}>
                    {role.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.65, flexGrow: 1, mb: 2.5, fontSize: '0.93rem' }}>
                    {role.description}
                  </Typography>

                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography sx={{ color: '#071d35', fontWeight: 800, fontSize: '0.9rem' }}>
                      Continue
                    </Typography>
                    <Box
                      className="role-arrow"
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '10px',
                        bgcolor: `${role.accent}16`,
                        color: role.accent,
                        display: 'grid',
                        placeItems: 'center',
                        transition: 'all 180ms ease',
                      }}
                    >
                      <ArrowForward sx={{ fontSize: 20 }} />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Alert
            severity="info"
            icon={<VerifiedUser />}
            sx={{
              mt: 3,
              borderRadius: '12px',
              bgcolor: '#eef7f7',
              color: '#36505d',
              border: '1px solid #d7ebea',
              '& .MuiAlert-icon': { color: '#10aaa5' },
              '& .MuiAlert-message': { fontWeight: 600, fontSize: '0.86rem' },
            }}
          >
            Accounts are created and managed by the administration.
          </Alert>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
            sx={{
              color: 'rgba(255,255,255,0.82)',
              fontWeight: 700,
              px: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' },
            }}
          >
            Back to home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SelectionRole;
