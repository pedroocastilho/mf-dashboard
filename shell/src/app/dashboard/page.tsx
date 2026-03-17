'use client';
// shell/src/app/dashboard/page.tsx
import Box from '@mui/material/Box';
import { Header } from '../../components/Header';
import { RemoteModule } from '../../components/RemoteModule';

export default function DashboardPage() {
  return (
    <Box>
      <Header title="Analytics" />
      <Box p={3}>
        <RemoteModule module="mfAnalytics/Analytics" />
      </Box>
    </Box>
  );
}
