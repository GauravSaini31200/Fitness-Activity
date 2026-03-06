import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  alpha,
  useTheme,
  LinearProgress,
} from '@mui/material';
import {
  DirectionsRun as RunIcon,
  DirectionsWalk as WalkIcon,
  DirectionsBike as BikeIcon,
  FitnessCenter as WeightIcon,
  Pool as SwimIcon,
  SelfImprovement as YogaIcon,
  Terrain as HikingIcon,
  MoreHoriz as OtherIcon,
  LocalFireDepartment as FireIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

const activityConfig = {
  RUNNING: {
    icon: RunIcon,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
    label: 'Running',
  },
  WALKING: {
    icon: WalkIcon,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    label: 'Walking',
  },
  CYCLING: {
    icon: BikeIcon,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    label: 'Cycling',
  },
  SWIMMING: {
    icon: SwimIcon,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
    label: 'Swimming',
  },
  YOGA: {
    icon: YogaIcon,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    label: 'Yoga',
  },
  WEIGHTLIFTING: {
    icon: WeightIcon,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    label: 'Weightlifting',
  },
  HIKING: {
    icon: HikingIcon,
    color: '#84cc16',
    gradient: 'linear-gradient(135deg, #84cc16 0%, #22c55e 100%)',
    label: 'Hiking',
  },
  OTHER: {
    icon: OtherIcon,
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
    label: 'Other',
  },
  DEFAULT: {
    icon: OtherIcon,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    label: 'Workout',
  },
};

const ActivityCard = ({ activity, compact = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const config = activityConfig[activity.type] || activityConfig.DEFAULT;
  const Icon = config.icon;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Today';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calorieGoal = 500;
  const progress = Math.min((activity.caloriesBurned / calorieGoal) * 100, 100);

  if (compact) {
    return (
      <Card
        onClick={() => navigate(`/activity/${activity.id}`)}
        sx={{
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateX(8px)',
            boxShadow: `0 4px 20px ${alpha(config.color, 0.2)}`,
          },
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                background: config.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {config.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activity.duration} min • {activity.caloriesBurned} kcal
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {formatDate(activity.createdAt)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onClick={() => navigate(`/activity/${activity.id}`)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -2,
          left: 16,
          right: 16,
          height: 4,
          background: config.gradient,
          borderRadius: '4px 4px 0 0',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              background: config.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 20px ${alpha(config.color, 0.3)}`,
            }}
          >
            <Icon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Chip
            label={formatDate(activity.createdAt)}
            size="small"
            sx={{
              bgcolor: alpha(config.color, 0.1),
              color: config.color,
              fontWeight: 500,
            }}
          />
        </Box>

        <Typography variant="h6" fontWeight={600} gutterBottom>
          {config.label}
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <TimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              <strong style={{ color: theme.palette.text.primary }}>{activity.duration}</strong> min
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <FireIcon sx={{ fontSize: 18, color: '#f97316' }} />
            <Typography variant="body2" color="text.secondary">
              <strong style={{ color: theme.palette.text.primary }}>{activity.caloriesBurned}</strong> kcal
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Daily Goal Progress
            </Typography>
            <Typography variant="caption" fontWeight={600} color={config.color}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: alpha(config.color, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: config.gradient,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            mt: 2,
            color: 'text.secondary',
            transition: 'color 0.2s ease',
            '&:hover': { color: config.color },
          }}
        >
          <Typography variant="caption" fontWeight={500}>
            View Details
          </Typography>
          <ArrowIcon sx={{ fontSize: 16, ml: 0.5 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
