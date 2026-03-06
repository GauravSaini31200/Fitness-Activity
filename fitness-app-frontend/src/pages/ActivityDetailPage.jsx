import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
  Skeleton,
  Card,
  CardContent,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  AccessTime as TimeIcon,
  LocalFireDepartment as FireIcon,
  CalendarMonth as CalendarIcon,
  DirectionsRun as RunIcon,
  DirectionsWalk as WalkIcon,
  DirectionsBike as BikeIcon,
  Pool as SwimIcon,
  FitnessCenter as WeightIcon,
  SelfImprovement as YogaIcon,
  Terrain as HikingIcon,
  MoreHoriz as OtherIcon,
  TipsAndUpdates as TipsIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Lightbulb as IdeaIcon,
  Shield as SafetyIcon,
  ExpandMore as ExpandIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Speed as SpeedIcon,
  Straighten as DistanceIcon,
  MonitorHeart as HeartIcon,
} from '@mui/icons-material';
import { getActivityDetail } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const activityConfig = {
  RUNNING: { icon: RunIcon, color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', label: 'Running' },
  WALKING: { icon: WalkIcon, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', label: 'Walking' },
  CYCLING: { icon: BikeIcon, color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)', label: 'Cycling' },
  SWIMMING: { icon: SwimIcon, color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)', label: 'Swimming' },
  YOGA: { icon: YogaIcon, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', label: 'Yoga' },
  WEIGHTLIFTING: { icon: WeightIcon, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', label: 'Weightlifting' },
  HIKING: { icon: HikingIcon, color: '#84cc16', gradient: 'linear-gradient(135deg, #84cc16 0%, #22c55e 100%)', label: 'Hiking' },
  OTHER: { icon: OtherIcon, color: '#64748b', gradient: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)', label: 'Other' },
  DEFAULT: { icon: OtherIcon, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', label: 'Workout' },
};

const ActivityDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState('analysis');

  useEffect(() => {
    fetchActivityDetail();
  }, [id]);

  const fetchActivityDetail = async () => {
    try {
      setLoading(true);
      const response = await getActivityDetail(id);
      setActivity(response.data[0]);
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading activity details..." />;
  }

  if (!activity) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" gutterBottom>
          Activity not found
        </Typography>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/activities')}>
          Back to Activities
        </Button>
      </Box>
    );
  }

  const config = activityConfig[activity.activityType] || activityConfig.DEFAULT;
  const Icon = config.icon;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown date';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/activities')}
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          Back to Activities
        </Button>
      </Box>

      {/* Activity Hero Section */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          mb: 4,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Background Gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 200,
            background: config.gradient,
            opacity: 0.1,
          }}
        />
        
        <Box sx={{ position: 'relative', p: { xs: 3, md: 5 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Activity Icon */}
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: 4,
                background: config.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 16px 40px ${alpha(config.color, 0.4)}`,
                flexShrink: 0,
              }}
            >
              <Icon sx={{ fontSize: 56, color: 'white' }} />
            </Box>

            {/* Activity Info */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Typography variant="h3" fontWeight={700}>
                  {config.label}
                </Typography>
                <Chip
                  label="Completed"
                  icon={<CheckIcon />}
                  color="success"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 3 }}>
                <CalendarIcon sx={{ fontSize: 20 }} />
                <Typography variant="body1">
                  {formatDate(activity.createdAt)}
                </Typography>
              </Box>

              {/* Stats Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      textAlign: 'center',
                    }}
                  >
                    <TimeIcon sx={{ fontSize: 24, color: 'primary.main', mb: 0.5 }} />
                    <Typography variant="h5" fontWeight={700}>
                      {activity.duration}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Minutes
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#f97316', 0.08),
                      textAlign: 'center',
                    }}
                  >
                    <FireIcon sx={{ fontSize: 24, color: '#f97316', mb: 0.5 }} />
                    <Typography variant="h5" fontWeight={700}>
                      {activity.caloriesBurned}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Calories
                    </Typography>
                  </Box>
                </Grid>
                {activity.distance && (
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.info.main, 0.08),
                        textAlign: 'center',
                      }}
                    >
                      <DistanceIcon sx={{ fontSize: 24, color: 'info.main', mb: 0.5 }} />
                      <Typography variant="h5" fontWeight={700}>
                        {activity.distance}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Kilometers
                      </Typography>
                    </Box>
                  </Grid>
                )}
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.secondary.main, 0.08),
                      textAlign: 'center',
                    }}
                  >
                    <SpeedIcon sx={{ fontSize: 24, color: 'secondary.main', mb: 0.5 }} />
                    <Typography variant="h5" fontWeight={700}>
                      {activity.duration > 0 ? Math.round(activity.caloriesBurned / activity.duration * 10) / 10 : 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      kcal/min
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<ShareIcon />}>
              Share
            </Button>
            <Button variant="outlined" startIcon={<EditIcon />}>
              Edit
            </Button>
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
              Delete
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* AI Recommendations Section */}
      {activity.recommendation && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TipsIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                AI-Powered Insights
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Personalized recommendations based on your activity
              </Typography>
            </Box>
          </Box>

          {/* Analysis Accordion */}
          <Accordion
            expanded={expanded === 'analysis'}
            onChange={handleAccordionChange('analysis')}
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '16px !important',
              mb: 2,
              '&::before': { display: 'none' },
              overflow: 'hidden',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandIcon />}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 36, height: 36 }}>
                  <IdeaIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={600}>
                  Performance Analysis
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {activity.recommendation}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Improvements Accordion */}
          {activity.improvements && activity.improvements.length > 0 && (
            <Accordion
              expanded={expanded === 'improvements'}
              onChange={handleAccordionChange('improvements')}
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '16px !important',
                mb: 2,
                '&::before': { display: 'none' },
                overflow: 'hidden',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandIcon />}
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.04),
                  '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.08) },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 36, height: 36 }}>
                    <WarningIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Areas for Improvement
                  </Typography>
                  <Chip label={activity.improvements.length} size="small" color="warning" />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                <List disablePadding>
                  {activity.improvements.map((improvement, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={improvement} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Suggestions Accordion */}
          {activity.suggestions && activity.suggestions.length > 0 && (
            <Accordion
              expanded={expanded === 'suggestions'}
              onChange={handleAccordionChange('suggestions')}
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '16px !important',
                mb: 2,
                '&::before': { display: 'none' },
                overflow: 'hidden',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandIcon />}
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.04),
                  '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.08) },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.success.main, width: 36, height: 36 }}>
                    <IdeaIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Suggestions
                  </Typography>
                  <Chip label={activity.suggestions.length} size="small" color="success" />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                <List disablePadding>
                  {activity.suggestions.map((suggestion, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Safety Tips Accordion */}
          {activity.safetyTips && activity.safetyTips.length > 0 && (
            <Accordion
              expanded={expanded === 'safety'}
              onChange={handleAccordionChange('safety')}
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '16px !important',
                '&::before': { display: 'none' },
                overflow: 'hidden',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandIcon />}
                sx={{
                  bgcolor: alpha(theme.palette.error.main, 0.04),
                  '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08) },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.error.main, width: 36, height: 36 }}>
                    <SafetyIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Safety Guidelines
                  </Typography>
                  <Chip label={activity.safetyTips.length} size="small" color="error" />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                <List disablePadding>
                  {activity.safetyTips.map((tip, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <SafetyIcon color="error" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={tip} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      )}

      {/* Quick Actions */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          What's Next?
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/activity/register')}
              sx={{ py: 2 }}
            >
              Log Another Activity
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/activities')}
              sx={{ py: 2 }}
            >
              View All Activities
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                py: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              }}
            >
              Set New Goal
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ActivityDetailPage;
