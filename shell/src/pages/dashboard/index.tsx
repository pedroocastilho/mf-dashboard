'use client';
import Box from '@mui/material/Box';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Header } from '../../components/Header';
import { RemoteModule } from '../../components/RemoteModule';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Box>
        <Header title="Analytics" />
        <Box p={3}>
          <RemoteModule module="mfAnalytics/Analytics" />
        </Box>
      </Box>
    </DashboardLayout>
  );
}
