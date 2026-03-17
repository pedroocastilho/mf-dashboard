'use client';
import Box from '@mui/material/Box';
import { Header } from '../../components/Header';

export default function DashboardPage() {
  return (
    <Box>
      <Header title="Analytics" />
      <Box p={3}>
        <iframe
          src="http://localhost:3001"
          style={{ width: '100%', height: '80vh', border: 'none', borderRadius: 12 }}
          title="Analytics"
        />
      </Box>
    </Box>
  );
}