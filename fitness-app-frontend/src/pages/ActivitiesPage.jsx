import { useEffect, useState, useContext } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Tabs,
  Tab,
  alpha,
  useTheme,
  Skeleton,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  LocalFireDepartment as FireIcon,
  AccessTime as TimeIcon,
  EmojiEvents as TrophyIcon,
  DirectionsRun as RunIcon,
  FilterList as FilterIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { AuthContext } from 'react-oauth2-code-pkce';
import { getActivities } from '../services/api';
import StatCard from '../components/common/StatCard';
import ActivityCard from '../components/common/ActivityCard';
import EmptyState from '../components/common/EmptyState';

const ActivitiesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { tokenData } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = ['all', 'RUNNING', 'WALKING', 'CYCLING', 'SWIMMING', 'YOGA', 'WEIGHTLIFTING', 'HIKING', 'OTHER'];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.type?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || activity.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalActivities: activities.length,
    totalCalories: activities.reduce((sum, a) => sum + (parseInt(a.caloriesBurned) || 0), 0),
    totalDuration: activities.reduce((sum, a) => sum + (parseInt(a.duration) || 0), 0),
    currentStreak: 7,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = tokenData?.name?.split(' ')[0] || tokenData?.preferred_username || 'Athlete';

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {getGreeting()}, {userName}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your progress and keep pushing towards your fitness goals.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/activity/register')}
            sx={{
              px: 3,
              py: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
            }}
          >
            Log Activity
          </Button>
        </Box>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Activities"
            value={stats.totalActivities}
            subtitle="All time"
            icon={RunIcon}
            color="primary"
            trend="up"
            trendValue="+12%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Calories Burned"
            value={stats.totalCalories.toLocaleString()}
            subtitle="kcal burned"
            icon={FireIcon}
            color="warning"
            trend="up"
            trendValue="+8%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Active Minutes"
            value={stats.totalDuration}
            subtitle="Total duration"
            icon={TimeIcon}
            color="info"
            trend="up"
            trendValue="+15%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            subtitle="Keep it up!"
            icon={TrophyIcon}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TextField
          placeholder="Search activities..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            minWidth: { xs: '100%', md: 280 },
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.default',
            },
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flex: 1 }}>
          {filters.map((filter) => (
            <Chip
              key={filter}
              label={filter === 'all' ? 'All Activities' : filter.charAt(0) + filter.slice(1).toLowerCase()}
              onClick={() => setSelectedFilter(filter)}
              color={selectedFilter === filter ? 'primary' : 'default'}
              variant={selectedFilter === filter ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </Box>

        <Button
          variant="outlined"
          startIcon={<CalendarIcon />}
          sx={{ minWidth: 'fit-content' }}
        >
          This Week
        </Button>
      </Paper>

      {/* Activities Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight={600}>
            Recent Activities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredActivities.length} activities found
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                <Skeleton
                  variant="rounded"
                  height={220}
                  sx={{ borderRadius: 4 }}
                />
              </Grid>
            ))}
          </Grid>
        ) : filteredActivities.length > 0 ? (
          <Grid container spacing={3}>
            {filteredActivities.map((activity) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={activity.id}>
                <ActivityCard activity={activity} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState
            icon={RunIcon}
            title="No activities yet"
            description="Start your fitness journey by logging your first activity. Track runs, walks, cycling sessions, and more!"
            actionLabel="Log Your First Activity"
            onAction={() => navigate('/activity/register')}
          />
        )}
      </Box>

      {/* Quick Tips Section */}
      {activities.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 4,
            border: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            💡 Quick Tips
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Stay consistent</strong> - Aim for at least 3-4 workout sessions per week for optimal results.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Mix it up</strong> - Combine cardio with strength training for a well-rounded fitness routine.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Rest & recover</strong> - Your body needs time to repair. Don't skip rest days!
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default ActivitiesPage;
