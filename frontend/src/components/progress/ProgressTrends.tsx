import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { getMetricTrends } from '@/services/progressService';
import { 
  ProgressTrend, 
  MEASUREMENT_FIELDS, 
  COMMON_MEASUREMENTS, 
  COMMON_EXERCISES, 
  MeasurementField 
} from '@/types/progress';
import { format } from 'date-fns';

export default function ProgressTrends() {
  const [selectedMetric, setSelectedMetric] = useState<string>('weight');
  const [timeRange, setTimeRange] = useState<number>(90);
  const [trendData, setTrendData] = useState<ProgressTrend | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allMetrics = [
    ...MEASUREMENT_FIELDS,
    ...COMMON_MEASUREMENTS,
    ...COMMON_EXERCISES
  ];

  useEffect(() => {
    fetchTrendData();
  }, [selectedMetric, timeRange]);

  const fetchTrendData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getMetricTrends(selectedMetric, timeRange);
      setTrendData(data);
    } catch (err) {
      console.error('Error fetching trend data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load trend data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetricChange = (event: SelectChangeEvent) => {
    setSelectedMetric(event.target.value);
  };

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(Number(event.target.value));
  };

  const formatChartData = (data: ProgressTrend | null) => {
    if (!data || !data.data || data.data.length === 0) return [];
    
    return data.data.map(item => ({
      date: format(new Date(item.date), 'MMM d'),
      value: item.value
    }));
  };

  const getMetricLabel = (metricKey: string): string => {
    const metric = allMetrics.find(m => m.key === metricKey);
    return metric ? metric.label : metricKey;
  };

  const getMetricUnit = (metricKey: string): string => {
    const metric = allMetrics.find(m => m.key === metricKey);
    return metric && metric.unit ? metric.unit : '';
  };

  const getChangeColor = (change: number | undefined): string => {
    if (change === undefined) return 'inherit';
    
    if ((selectedMetric === 'weight' || selectedMetric === 'body_fat') && change < 0) {
      return 'success.main';
    }
    
    if (change > 0) {
      return 'success.main';
    } else if (change < 0) {
      return 'error.main';
    }
    
    return 'inherit';
  };

  const formatChange = (change: number | undefined): string => {
    if (change === undefined || change === null) return 'No change';
    
    const unit = getMetricUnit(selectedMetric);
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}${unit}`;
  };

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="metric-select-label">Metric</InputLabel>
            <Select
              labelId="metric-select-label"
              id="metric-select"
              value={selectedMetric}
              label="Metric"
              onChange={handleMetricChange}
            >
              <MenuItem value="" disabled>
                <em>Select a metric</em>
              </MenuItem>
              
              <MenuItem disabled sx={{ opacity: 0.7 }}>
                <Typography variant="subtitle2">Physical Metrics</Typography>
              </MenuItem>
              {MEASUREMENT_FIELDS.filter(m => m.category === 'physical').map((metric) => (
                <MenuItem key={metric.key} value={metric.key}>
                  {metric.label} {metric.unit ? `(${metric.unit})` : ''}
                </MenuItem>
              ))}
              
              <Divider />
              
              <MenuItem disabled sx={{ opacity: 0.7 }}>
                <Typography variant="subtitle2">Body Measurements</Typography>
              </MenuItem>
              {COMMON_MEASUREMENTS.map((metric) => (
                <MenuItem key={metric.key} value={metric.key}>
                  {metric.label} {metric.unit ? `(${metric.unit})` : ''}
                </MenuItem>
              ))}
              
              <Divider />
              
              <MenuItem disabled sx={{ opacity: 0.7 }}>
                <Typography variant="subtitle2">Workout Performance</Typography>
              </MenuItem>
              {COMMON_EXERCISES.map((metric) => (
                <MenuItem key={metric.key} value={metric.key}>
                  {metric.label} {metric.unit ? `(${metric.unit})` : ''}
                </MenuItem>
              ))}
              
              <Divider />
              
              <MenuItem disabled sx={{ opacity: 0.7 }}>
                <Typography variant="subtitle2">Subjective Metrics</Typography>
              </MenuItem>
              {MEASUREMENT_FIELDS.filter(m => m.category === 'subjective').map((metric) => (
                <MenuItem key={metric.key} value={metric.key}>
                  {metric.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="time-range-select-label">Time Range</InputLabel>
            <Select
              labelId="time-range-select-label"
              id="time-range-select"
              value={timeRange.toString()}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value={30}>Last 30 days</MenuItem>
              <MenuItem value={90}>Last 90 days</MenuItem>
              <MenuItem value={180}>Last 6 months</MenuItem>
              <MenuItem value={365}>Last year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : trendData && trendData.data.length > 0 ? (
        <Box>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>
                    {getMetricLabel(selectedMetric)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Showing data for the last {timeRange} days
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle1">
                    Change: 
                    <Box 
                      component="span" 
                      sx={{ 
                        ml: 1, 
                        color: getChangeColor(trendData.change),
                        fontWeight: 'bold'
                      }}
                    >
                      {formatChange(trendData.change)}
                    </Box>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trendData.data.length} data points
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Paper sx={{ p: 2, height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formatChartData(trendData)}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  label={{ 
                    value: getMetricUnit(selectedMetric), 
                    angle: -90, 
                    position: 'insideLeft' 
                  }} 
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name={getMetricLabel(selectedMetric)}
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1">
            No data available for this metric and time range.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try selecting a different metric or time range, or log some progress entries.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
