import { Box, CircularProgress, Typography, alpha, useTheme } from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';

const LoadingSpinner = ({ message = 'Loading...', fullScreen = false }) => {
  const theme = useTheme();

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 4,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          size={60}
          thickness={3}
          sx={{
            color: theme.palette.primary.main,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1, transform: 'scale(1)' },
              '50%': { opacity: 0.7, transform: 'scale(0.9)' },
            },
          }}
        >
          <FitnessCenter
            sx={{
              fontSize: 24,
              color: theme.palette.primary.main,
            }}
          />
        </Box>
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: alpha(theme.palette.background.default, 0.9),
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;
