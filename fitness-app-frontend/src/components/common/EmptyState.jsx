import { Box, Typography, Button, alpha, useTheme } from '@mui/material';
import { SentimentDissatisfied, Refresh } from '@mui/icons-material';

const EmptyState = ({
  icon: Icon = SentimentDissatisfied,
  title = 'No data found',
  description = 'There is nothing to show here yet.',
  actionLabel,
  onAction,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Icon
          sx={{
            fontSize: 56,
            color: alpha(theme.palette.primary.main, 0.5),
          }}
        />
      </Box>
      <Typography
        variant="h5"
        fontWeight={600}
        gutterBottom
        sx={{ color: 'text.primary' }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 400, mb: 3 }}
      >
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={onAction}
          sx={{
            px: 4,
            py: 1.5,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
