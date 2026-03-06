import { useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import {
  FitnessCenter as FitnessIcon,
  DirectionsRun as RunIcon,
  LocalFireDepartment as FireIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { AuthContext } from 'react-oauth2-code-pkce';

const features = [
  {
    icon: RunIcon,
    title: 'Track Workouts',
    description: 'Log running, cycling, swimming, and more',
    color: '#ef4444',
  },
  {
    icon: FireIcon,
    title: 'Burn Calories',
    description: 'Monitor your calorie burn in real-time',
    color: '#f97316',
  },
  {
    icon: TimelineIcon,
    title: 'See Progress',
    description: 'Visualize your fitness journey over time',
    color: '#3b82f6',
  },
  {
    icon: TrophyIcon,
    title: 'Achieve Goals',
    description: 'Set targets and celebrate achievements',
    color: '#10b981',
  },
];

const LoginPage = () => {
  const theme = useTheme();
  const { logIn } = useContext(AuthContext);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* Left Side - Branding */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flex: 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <Box sx={{ position: 'relative', textAlign: 'center', color: 'white', maxWidth: 500 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 4,
              backdropFilter: 'blur(10px)',
            }}
          >
            <FitnessIcon sx={{ fontSize: 56, color: 'white' }} />
          </Box>
          
          <Typography variant="h2" fontWeight={700} gutterBottom>
            FitTrack Pro
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 6 }}>
            Your personal fitness companion for a healthier lifestyle
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 6 }} key={index}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <feature.icon sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            right: 40,
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            color: 'white',
          }}
        >
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '1M+', label: 'Workouts Logged' },
            { value: '500M+', label: 'Calories Burned' },
          ].map((stat, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right Side - Login */}
      <Box
        sx={{
          flex: { xs: 1, lg: 0.6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
          position: 'relative',
        }}
      >
        {/* Mobile Logo */}
        <Box
          sx={{
            display: { xs: 'flex', lg: 'none' },
            alignItems: 'center',
            gap: 2,
            mb: 6,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FitnessIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h4" fontWeight={700}>
            FitTrack Pro
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            maxWidth: 450,
            width: '100%',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <LockIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue your fitness journey and track your progress
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => logIn()}
            sx={{
              py: 2,
              fontSize: '1rem',
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
              '&:hover': {
                boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.5)}`,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Sign In with SSO
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', mt: 3 }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Paper>

        {/* Mobile Features */}
        <Box
          sx={{
            display: { xs: 'grid', lg: 'none' },
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            mt: 6,
            maxWidth: 450,
            width: '100%',
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(feature.color, 0.08),
              }}
            >
              <feature.icon sx={{ color: feature.color, fontSize: 24 }} />
              <Typography variant="body2" fontWeight={500}>
                {feature.title}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            position: 'absolute',
            bottom: 24,
            textAlign: 'center',
          }}
        >
          © 2026 FitTrack Pro. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
