'use client';
import Box from '@mui/material/Box';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box display="flex" minHeight="100vh" sx={{ background: '#F5F7FA' }}>
      <Sidebar />
      <Box component="main" flexGrow={1} overflow="auto">
        {children}
      </Box>
    </Box>
  );
}
