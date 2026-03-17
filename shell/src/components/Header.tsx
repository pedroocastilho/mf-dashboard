'use client';
// shell/src/components/Header.tsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../store/auth.store';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuthStore();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  const isAdmin = user?.roles.includes('admin');

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        color: '#1E3A5F',
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" fontWeight={600} flexGrow={1} color="#1E3A5F">
          {title}
        </Typography>

        {user && (
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box textAlign="right">
              <Typography variant="body2" fontWeight={600} color="#1E3A5F" lineHeight={1.2}>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: '#2E75B6',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>

            <Chip
              label={isAdmin ? 'Admin' : 'Viewer'}
              size="small"
              sx={{
                background: isAdmin ? '#EFF6FF' : '#F0FDF4',
                color: isAdmin ? '#1D4ED8' : '#15803D',
                fontWeight: 600,
                fontSize: 11,
              }}
            />

            <Tooltip title="Sair">
              <IconButton
                component="a"
                href="/auth/logout"
                size="small"
                sx={{ color: '#6B7280', '&:hover': { color: '#EF4444' } }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
