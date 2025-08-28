'use client';

import { Box, Container, Typography, Paper, Grid, Button, useTheme, useMediaQuery } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useTaskStatsViewModel } from '@/hooks/useTaskStatsViewModel';
import StatsCard from '@/components/stats/StatsCard';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function StatsPage() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('md'));
  const viewModel = useTaskStatsViewModel();
  const stats = viewModel.getTaskStats();

  // Prepare chart data
  const pieData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      data: [stats.completed, stats.inProgress, stats.pending],
      backgroundColor: [
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main,
      ],
      borderColor: theme.palette.background.paper,
      borderWidth: 2,
    }],
  };

  const barData = {
    labels: stats.completedByDay.map(day => day.date),
    datasets: [{
      label: 'Completed Tasks',
      data: stats.completedByDay.map(day => day.count),
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.dark,
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: theme.palette.text.primary,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: theme.palette.text.primary,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      x: {
        ticks: {
          color: theme.palette.text.primary,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Statistics
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={viewModel.exportStats}
        >
          Export as CSV
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={6}>
          <StatsCard
            title="Current Streak"
            value={`${stats.streak} days`}
            subtitle="Keep up the momentum!"
            icon="🔥"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatsCard
            title="Productivity Score"
            value={`${stats.productivityScore}%`}
            subtitle="Based on completed vs. overdue tasks"
            icon="📈"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Task Status Distribution
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Pie data={pieData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Completed Tasks (Last 7 Days)
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Bar data={barData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
