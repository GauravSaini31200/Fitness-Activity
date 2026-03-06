import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  alpha,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Slider,
  FormHelperText,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  DirectionsRun as RunIcon,
  DirectionsWalk as WalkIcon,
  DirectionsBike as BikeIcon,
  Pool as SwimIcon,
  FitnessCenter as WeightIcon,
  SelfImprovement as YogaIcon,
  Terrain as HikingIcon,
  MoreHoriz as OtherIcon,
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
  Check as CheckIcon,
  AccessTime as TimeIcon,
  LocalFireDepartment as FireIcon,
  Notes as NotesIcon,
  CalendarMonth as CalendarIcon,
  Speed as SpeedIcon,
  Straighten as DistanceIcon,
  MonitorHeart as HeartIcon,
  FitnessCenter as RepsIcon,
} from '@mui/icons-material';
import { addActivity } from '../services/api';

const activityTypes = [
  { value: 'RUNNING', label: 'Running', icon: RunIcon, color: '#ef4444', description: 'Outdoor or treadmill running', hasDistance: true, hasPace: true },
  { value: 'WALKING', label: 'Walking', icon: WalkIcon, color: '#10b981', description: 'Casual or brisk walking', hasDistance: true, hasSteps: true },
  { value: 'CYCLING', label: 'Cycling', icon: BikeIcon, color: '#3b82f6', description: 'Road or stationary biking', hasDistance: true, hasSpeed: true },
  { value: 'SWIMMING', label: 'Swimming', icon: SwimIcon, color: '#06b6d4', description: 'Pool or open water swimming', hasDistance: true, hasLaps: true },
  { value: 'YOGA', label: 'Yoga', icon: YogaIcon, color: '#f59e0b', description: 'Flexibility & mindfulness', hasPoses: true },
  { value: 'WEIGHTLIFTING', label: 'Weightlifting', icon: WeightIcon, color: '#8b5cf6', description: 'Strength & resistance training', hasSets: true, hasReps: true, hasWeight: true },
  { value: 'HIKING', label: 'Hiking', icon: HikingIcon, color: '#84cc16', description: 'Trail & mountain hiking', hasDistance: true, hasElevation: true },
  { value: 'OTHER', label: 'Other', icon: OtherIcon, color: '#64748b', description: 'Any other activity type', hasCustom: true },
];

const steps = ['Select Activity', 'Enter Details', 'Review & Submit'];

const ActivityRegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    caloriesBurned: '',
    startTime: new Date().toISOString().slice(0, 16), // datetime-local format
    // Additional metrics
    notes: '',
    intensity: 'moderate',
    distance: '',
    pace: '',
    steps: '',
    speed: '',
    laps: '',
    sets: '',
    reps: '',
    weight: '',
    elevation: '',
    heartRate: '',
    customActivity: '',
  });

  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0 && !formData.type) {
      newErrors.type = 'Please select an activity type';
    }

    if (step === 1) {
      if (!formData.duration || formData.duration <= 0) {
        newErrors.duration = 'Please enter a valid duration';
      }
      if (!formData.caloriesBurned || formData.caloriesBurned <= 0) {
        newErrors.caloriesBurned = 'Please enter calories burned';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Build additionalMetrics based on activity type
  const buildAdditionalMetrics = () => {
    const metrics = {
      intensity: formData.intensity,
      notes: formData.notes,
    };

    // Add heart rate if provided
    if (formData.heartRate) metrics.heartRate = parseInt(formData.heartRate);

    // Add activity-specific metrics
    const activityConfig = activityTypes.find(a => a.value === formData.type);
    if (activityConfig) {
      if (activityConfig.hasDistance && formData.distance) metrics.distance = parseFloat(formData.distance);
      if (activityConfig.hasPace && formData.pace) metrics.pace = formData.pace;
      if (activityConfig.hasSteps && formData.steps) metrics.steps = parseInt(formData.steps);
      if (activityConfig.hasSpeed && formData.speed) metrics.avgSpeed = parseFloat(formData.speed);
      if (activityConfig.hasLaps && formData.laps) metrics.laps = parseInt(formData.laps);
      if (activityConfig.hasSets && formData.sets) metrics.sets = parseInt(formData.sets);
      if (activityConfig.hasReps && formData.reps) metrics.reps = parseInt(formData.reps);
      if (activityConfig.hasWeight && formData.weight) metrics.weight = parseFloat(formData.weight);
      if (activityConfig.hasElevation && formData.elevation) metrics.elevationGain = parseInt(formData.elevation);
      if (activityConfig.hasCustom && formData.customActivity) metrics.customActivity = formData.customActivity;
    }

    return metrics;
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;

    setLoading(true);
    try {
      // Build payload matching ActivityRequest DTO
      const payload = {
        type: formData.type,
        duration: parseInt(formData.duration),
        caloriesBurned: parseInt(formData.caloriesBurned),
        startTime: new Date(formData.startTime).toISOString(),
        additionalMetrics: buildAdditionalMetrics(),
      };

      await addActivity(payload);

      setSnackbar({
        open: true,
        message: 'Activity logged successfully! 🎉',
        severity: 'success',
      });

      setTimeout(() => {
        navigate('/activities');
      }, 1500);
    } catch (error) {
      console.error('Error adding activity:', error);
      setSnackbar({
        open: true,
        message: 'Failed to log activity. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedActivity = activityTypes.find((a) => a.value === formData.type);

  const estimateCalories = () => {
    const duration = parseInt(formData.duration) || 0;
    const baseRates = {
      RUNNING: 10,
      WALKING: 4,
      CYCLING: 8,
      SWIMMING: 9,
      YOGA: 3,
      WEIGHTLIFTING: 6,
      HIKING: 7,
      OTHER: 5,
    };
    const intensityMultiplier = { low: 0.8, moderate: 1, high: 1.3 };
    const baseRate = baseRates[formData.type] || 5;
    return Math.round(duration * baseRate * intensityMultiplier[formData.intensity]);
  };

  // Get activity-specific fields
  const getActivitySpecificFields = () => {
    const activityConfig = activityTypes.find(a => a.value === formData.type);
    if (!activityConfig) return null;

    const fields = [];

    if (activityConfig.hasDistance) {
      fields.push(
        <Grid size={{ xs: 12, md: 6 }} key="distance">
          <TextField
            fullWidth
            label="Distance"
            type="number"
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><DistanceIcon color="action" /></InputAdornment>,
                endAdornment: <InputAdornment position="end">km</InputAdornment>,
              },
            }}
          />
        </Grid>
      );
    }

    if (activityConfig.hasPace) {
      fields.push(
        <Grid size={{ xs: 12, md: 6 }} key="pace">
          <TextField
            fullWidth
            label="Average Pace"
            placeholder="e.g., 5:30"
            value={formData.pace}
            onChange={(e) => setFormData({ ...formData, pace: e.target.value })}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><SpeedIcon color="action" /></InputAdornment>,
                endAdornment: <InputAdornment position="end">min/km</InputAdornment>,
              },
            }}
          />
        </Grid>
      );
    }

    if (activityConfig.hasSteps) {
      fields.push(
        <Grid size={{ xs: 12, md: 6 }} key="steps">
          <TextField
            fullWidth
            label="Steps"
            type="number"
            value={formData.steps}
            onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
          />
        </Grid>
      );
    }

    if (activityConfig.hasSpeed) {
      fields.push(
        <Grid size={{ xs: 12, md: 6 }} key="speed">
          <TextField
            fullWidth
            label="Average Speed"
            type="number"
            value={formData.speed}
            onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><SpeedIcon color="action" /></InputAdornment>,
                endAdornment: <InputAdornment position="end">km/h</InputAdornment>,
              },
            }}
          />
        </Grid>
      );
    }

    if (activityConfig.hasLaps) {
      fields.push(
        <Grid size={{ xs: 12, md: 6 }} key="laps">
          <TextField
            fullWidth
            label="Laps"
            type="number"
            value={formData.laps}
            onChange={(e) => setFormData({ ...formData, laps: e.target.value })}
          />
        </Grid>
      );
    }

    if (activityConfig.hasSets) {
      fields.push(
        <Grid size={{ xs: 12, md: 4 }} key="sets">
          <TextField
            fullWidth
            label="Sets"
            type="number"
            value={formData.sets}
            onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
          />
        </Grid>
      );
    }

    if (activityConfig.hasReps) {
      fields.push(
        <Grid size={{ xs: 12, md: 4 }} key="reps">
          <TextField
            fullWidth
            label="Reps"
            type="number"
            value={formData.reps}
            onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><RepsIcon color="action" /></InputAdornment>,
              },
            }}
          />
        </Grid>
      );
    }

    if (activityConfig.hasWeight) {
      fields.push(
        <Grid size={{ xs: 12, md: 4 }} key="weight">
          <TextField
            fullWidth
            label="Weight Lifted"
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              },
            }}
          />
        </Grid>
      );
    }

    if (activityConfig.hasElevation) {
      fields.push(
        <Grid size={{ xs: 12, md: 6 }} key="elevation">
          <TextField
            fullWidth
            label="Elevation Gain"
            type="number"
            value={formData.elevation}
            onChange={(e) => setFormData({ ...formData, elevation: e.target.value })}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><HikingIcon color="action" /></InputAdornment>,
                endAdornment: <InputAdornment position="end">m</InputAdornment>,
              },
            }}
          />
        </Grid>
      );
    }

    if (activityConfig.hasCustom) {
      fields.push(
        <Grid size={{ xs: 12 }} key="custom">
          <TextField
            fullWidth
            label="Activity Name"
            placeholder="Describe your activity"
            value={formData.customActivity}
            onChange={(e) => setFormData({ ...formData, customActivity: e.target.value })}
          />
        </Grid>
      );
    }

    return fields;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              What activity did you do?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Select the type of workout you completed
            </Typography>

            <Grid container spacing={2}>
              {activityTypes.map((activity) => {
                const Icon = activity.icon;
                const isSelected = formData.type === activity.value;

                return (
                  <Grid size={{ xs: 6, md: 4 }} key={activity.value}>
                    <Card
                      onClick={() => setFormData({ ...formData, type: activity.value })}
                      sx={{
                        cursor: 'pointer',
                        height: '100%',
                        border: `2px solid ${isSelected ? activity.color : theme.palette.divider}`,
                        bgcolor: isSelected ? alpha(activity.color, 0.05) : 'background.paper',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: activity.color,
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 3,
                            bgcolor: alpha(activity.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                            transition: 'all 0.2s ease',
                            ...(isSelected && {
                              bgcolor: activity.color,
                            }),
                          }}
                        >
                          <Icon
                            sx={{
                              fontSize: 32,
                              color: isSelected ? 'white' : activity.color,
                            }}
                          />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {activity.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.description}
                        </Typography>
                        {isSelected && (
                          <Chip
                            icon={<CheckIcon />}
                            label="Selected"
                            size="small"
                            sx={{
                              mt: 1.5,
                              bgcolor: activity.color,
                              color: 'white',
                              '& .MuiChip-icon': { color: 'white' },
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
            {errors.type && (
              <Typography color="error" variant="caption" sx={{ mt: 2, display: 'block' }}>
                {errors.type}
              </Typography>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Activity Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Enter the details of your {selectedActivity?.label.toLowerCase()} session
            </Typography>

            <Grid container spacing={3}>
              {/* Start Time */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                    inputLabel: { shrink: true },
                  }}
                />
              </Grid>

              {/* Duration */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  error={!!errors.duration}
                  helperText={errors.duration}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <TimeIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                    },
                  }}
                />
              </Grid>

              {/* Calories */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Calories Burned"
                  type="number"
                  value={formData.caloriesBurned}
                  onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                  error={!!errors.caloriesBurned}
                  helperText={errors.caloriesBurned || `Estimated: ~${estimateCalories()} kcal`}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <FireIcon sx={{ color: '#f97316' }} />
                        </InputAdornment>
                      ),
                      endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                    },
                  }}
                />
              </Grid>

              {/* Heart Rate */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Avg Heart Rate (optional)"
                  type="number"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <HeartIcon color="error" />
                        </InputAdornment>
                      ),
                      endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
                    },
                  }}
                />
              </Grid>

              {/* Activity-specific fields */}
              {getActivitySpecificFields()}

              {/* Intensity */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Intensity Level
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {['low', 'moderate', 'high'].map((level) => (
                      <Chip
                        key={level}
                        label={level.charAt(0).toUpperCase() + level.slice(1)}
                        onClick={() => setFormData({ ...formData, intensity: level })}
                        color={formData.intensity === level ? 'primary' : 'default'}
                        variant={formData.intensity === level ? 'filled' : 'outlined'}
                        sx={{ flex: 1, py: 2.5 }}
                      />
                    ))}
                  </Box>
                </FormControl>
              </Grid>

              {/* Notes */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Notes (optional)"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How did the workout feel? Any highlights?"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                          <NotesIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Review Your Activity
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Make sure everything looks correct before submitting
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${alpha(selectedActivity?.color || theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    bgcolor: selectedActivity?.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 24px ${alpha(selectedActivity?.color || '#000', 0.3)}`,
                  }}
                >
                  {selectedActivity && <selectedActivity.icon sx={{ fontSize: 40, color: 'white' }} />}
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {selectedActivity?.label}
                  </Typography>
                  <Chip
                    label={formData.intensity.charAt(0).toUpperCase() + formData.intensity.slice(1) + ' Intensity'}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                    <TimeIcon sx={{ fontSize: 28, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h5" fontWeight={700}>
                      {formData.duration}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Minutes
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha('#f97316', 0.05), borderRadius: 2 }}>
                    <FireIcon sx={{ fontSize: 28, color: '#f97316', mb: 1 }} />
                    <Typography variant="h5" fontWeight={700}>
                      {formData.caloriesBurned}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Calories
                    </Typography>
                  </Box>
                </Grid>
                {formData.distance && (
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight={700}>
                        {formData.distance}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Kilometers
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {formData.notes && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2">{formData.notes}</Typography>
                </Box>
              )}
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/activities')}
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          Back to Activities
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Log New Activity
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Record your workout and track your progress
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              slotProps={{
                stepIcon: {
                  sx: {
                    '&.Mui-completed': { color: theme.palette.secondary.main },
                    '&.Mui-active': { color: theme.palette.primary.main },
                  },
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 4,
          mb: 4,
        }}
      >
        {renderStepContent(activeStep)}
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<BackIcon />}
          sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
        >
          Back
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={<CheckIcon />}
            sx={{
              px: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
          >
            {loading ? 'Submitting...' : 'Submit Activity'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ForwardIcon />}
            sx={{ px: 4 }}
          >
            Continue
          </Button>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActivityRegisterPage;
