import { useLocation, useNavigate } from 'react-router';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  alpha,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AddCircleOutline as AddIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';

const menuItems = [
  {
    title: 'My Activities',
    path: '/activities',
    icon: DashboardIcon,
    description: 'View all activities',
  },
  {
    title: 'Log Activity',
    path: '/activity/register',
    icon: AddIcon,
    description: 'Record new workout',
    badge: 'New',
  },
  {
    title: 'Progress',
    path: '/progress',
    icon: TimelineIcon,
    description: 'Track your journey',
    disabled: true,
  },
  {
    title: 'Achievements',
    path: '/achievements',
    icon: TrophyIcon,
    description: 'Your milestones',
    disabled: true,
  },
];

const bottomMenuItems = [
  {
    title: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
    disabled: true,
  },
  {
    title: 'Help & Support',
    path: '/help',
    icon: HelpIcon,
    disabled: true,
  },
];

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/activities') {
      return location.pathname === '/activities';
    }
    return location.pathname.startsWith(path);
  };

  const renderMenuItem = (item, index) => {
    const active = isActive(item.path);
    
    return (
      <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          onClick={() => !item.disabled && navigate(item.path)}
          disabled={item.disabled}
          sx={{
            borderRadius: 2,
            mx: 1,
            py: 1.5,
            position: 'relative',
            overflow: 'hidden',
            bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            '&:hover': {
              bgcolor: active
                ? alpha(theme.palette.primary.main, 0.15)
                : alpha(theme.palette.primary.main, 0.05),
            },
            '&::before': active
              ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 4,
                  height: '60%',
                  borderRadius: '0 4px 4px 0',
                  bgcolor: theme.palette.primary.main,
                }
              : {},
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 44,
              color: active ? theme.palette.primary.main : 'text.secondary',
            }}
          >
            <item.icon
              sx={{
                fontSize: 24,
                transition: 'transform 0.2s ease',
                ...(active && { transform: 'scale(1.1)' }),
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: active ? 600 : 500,
                    color: active ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {item.title}
                </Typography>
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color="primary"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            }
            secondary={
              item.description && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    opacity: 0.7,
                  }}
                >
                  {item.description}
                </Typography>
              )
            }
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        pt: 10,
        bgcolor: 'background.paper',
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ px: 2, mb: 1 }}>
        <Typography
          variant="overline"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.7rem',
            letterSpacing: 1.2,
            px: 1,
          }}
        >
          Main Menu
        </Typography>
      </Box>

      <List sx={{ flex: 1 }}>{menuItems.map(renderMenuItem)}</List>

      <Box sx={{ px: 2, mb: 1 }}>
        <Typography
          variant="overline"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.7rem',
            letterSpacing: 1.2,
            px: 1,
          }}
        >
          Support
        </Typography>
      </Box>

      <List sx={{ pb: 2 }}>{bottomMenuItems.map(renderMenuItem)}</List>

      {/* Pro Banner */}
      <Box
        sx={{
          mx: 2,
          mb: 2,
          p: 2,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Upgrade to Pro
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 1.5 }}>
          Unlock advanced analytics, AI coaching, and more!
        </Typography>
        <Box
          component="button"
          sx={{
            width: '100%',
            py: 1,
            px: 2,
            border: 'none',
            borderRadius: 2,
            bgcolor: 'white',
            color: theme.palette.primary.main,
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
        >
          Get Pro
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
