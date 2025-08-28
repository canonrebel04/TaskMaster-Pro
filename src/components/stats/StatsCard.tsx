import { Paper, Box, Typography, useTheme } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: -20,
          top: -20,
          fontSize: '100px',
          opacity: 0.1,
          transform: 'rotate(15deg)',
        }}
      >
        {icon}
      </Box>
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      
      <Typography 
        variant="h3" 
        component="div" 
        sx={{ 
          mb: 1,
          color: theme.palette.primary.main,
          fontWeight: 'bold',
        }}
      >
        {value}
      </Typography>
      
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Paper>
  );
}
