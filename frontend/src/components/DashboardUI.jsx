import React from 'react';
import { Avatar, Box, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';

export const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card
    elevation={0}
    sx={{
      height: '100%',
      borderRadius: '16px',
      border: '1px solid',
      borderColor: 'rgba(7,29,53,0.08)',
      overflow: 'hidden',
      position: 'relative',
      transition: 'transform 180ms ease, box-shadow 180ms ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 14px 34px ${color}1A`,
      },
    }}
  >
    <Box sx={{ position: 'absolute', width: 70, height: 70, right: -28, top: -28, borderRadius: '50%', bgcolor: `${color}12` }} />
    <CardContent sx={{ p: 2.25, '&:last-child': { pb: 2.25 } }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            bgcolor: `${color}14`,
            color,
            width: 52,
            height: 52,
            borderRadius: '14px',
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 25 } })}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {title}
          </Typography>
          <Typography noWrap title={value} sx={{ color: '#071d35', fontWeight: 850, fontSize: '1.55rem', lineHeight: 1.15, my: 0.35 }}>
            {value}
          </Typography>
          {subtitle && <Typography noWrap sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{subtitle}</Typography>}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export const ChartCard = ({ title, subtitle, action, children }) => (
  <Card
    elevation={0}
    sx={{
      height: 400,
      borderRadius: '16px',
      border: '1px solid rgba(7,29,53,0.08)',
      boxShadow: '0 8px 26px rgba(7,29,53,0.035)',
      overflow: 'hidden',
    }}
  >
    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Box>
          <Typography sx={{ color: '#071d35', fontWeight: 800, fontSize: '1.02rem' }}>{title}</Typography>
          {subtitle && <Typography sx={{ color: 'text.secondary', fontSize: '0.76rem', mt: 0.25 }}>{subtitle}</Typography>}
        </Box>
        {action}
      </Stack>
      {children}
    </CardContent>
  </Card>
);

export const DashboardHeader = ({ eyebrow, title, description }) => (
  <Box
    sx={{
      mb: 3,
      p: { xs: 2.25, md: 3 },
      borderRadius: '18px',
      background: 'linear-gradient(135deg, #071d35 0%, #0b3154 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Box sx={{ position: 'absolute', width: 180, height: 180, right: -80, top: -100, borderRadius: '50%', bgcolor: 'rgba(16,207,201,0.10)' }} />
    <Typography sx={{ color: '#56e0da', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 0.75 }}>
      {eyebrow}
    </Typography>
    <Typography sx={{ fontWeight: 850, fontSize: { xs: '1.55rem', md: '2rem' }, letterSpacing: '-0.035em', mb: 0.5 }}>
      {title}
    </Typography>
    <Typography sx={{ color: 'rgba(255,255,255,0.68)', fontSize: '0.9rem' }}>{description}</Typography>
  </Box>
);

export const DashboardLoading = () => (
  <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
    <CircularProgress />
  </Box>
);
