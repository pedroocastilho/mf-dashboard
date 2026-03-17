'use client';
// shell/src/components/Sidebar.tsx
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Analytics', href: '/dashboard', icon: <BarChartIcon /> },
  { label: 'Usuários', href: '/dashboard/users', icon: <PeopleIcon /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: '#1E3A5F',
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      {/* Logo */}
      <Box px={2.5} py={3} display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            width: 36,
            height: 36,
            background: '#2E75B6',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DashboardIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Typography fontWeight={700} fontSize={16} color="#fff">
          MF Dashboard
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2 }} />

      {/* Navigation */}
      <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': { background: 'rgba(255,255,255,0.1)', color: '#fff' },
                  '&.Mui-selected': { background: 'rgba(255,255,255,0.15)' },
                  '&.Mui-selected:hover': { background: 'rgba(255,255,255,0.2)' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box px={2.5} py={2}>
        <Typography fontSize={11} color="rgba(255,255,255,0.4)">
          v1.0.0 — Keycloak + MF
        </Typography>
      </Box>
    </Drawer>
  );
}
