import { Box, Paper, Typography, alpha, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary', trend, trendValue }) => {
  const theme = useTheme();
  const colorValue = theme.palette[color]?.main || color;

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp sx={{ fontSize: 16 }} />;
    if (trend === 'down') return <TrendingDown sx={{ fontSize: 16 }} />;
    return <TrendingFlat sx={{ fontSize: 16 }} />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return theme.palette.success.main;
    if (trend === 'down') return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: alpha(colorValue, 0.3),
          boxShadow: `0 8px 30px ${alpha(colorValue, 0.15)}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${colorValue} 0%, ${alpha(colorValue, 0.5)} 100%)`,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: 1,
              display: 'block',
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          {trendValue && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 1,
                color: getTrendColor(),
              }}
            >
              {getTrendIcon()}
              <Typography variant="caption" fontWeight={600}>
                {trendValue}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                vs last week
              </Typography>
            </Box>
          )}
        </Box>
        {Icon && (
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              bgcolor: alpha(colorValue, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 28, color: colorValue }} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StatCard;
