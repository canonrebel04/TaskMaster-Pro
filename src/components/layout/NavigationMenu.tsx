'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BottomNavigation, BottomNavigationAction, Paper, useMediaQuery, useTheme } from '@mui/material';
import {
  FormatListBulleted as TasksIcon,
  CalendarMonth as CalendarIcon,
  QueryStats as StatsIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';

export default function NavigationMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const t = useTranslations('Common');

  // Only show on mobile and main app pages
  const showNavigation = isMobile && ['/tasks', '/calendar', '/stats', '/profile'].includes(pathname);

  if (!showNavigation) return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={pathname}
        onChange={(_, newValue) => {
          router.push(newValue);
        }}
        showLabels
      >
        <BottomNavigationAction
          label={t('tasks')}
          value="/tasks"
          icon={<TasksIcon />}
        />
        <BottomNavigationAction
          label={t('calendar')}
          value="/calendar"
          icon={<CalendarIcon />}
        />
        <BottomNavigationAction
          label={t('statistics')}
          value="/stats"
          icon={<StatsIcon />}
        />
        <BottomNavigationAction
          label={t('profile')}
          value="/profile"
          icon={<ProfileIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
