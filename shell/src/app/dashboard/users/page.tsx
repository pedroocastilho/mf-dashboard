'use client';
import Box from '@mui/material/Box';
import { Header } from '../../../components/Header';

export default function UsersPage() {
  return (
    <Box>
      <Header title="Gestão de Usuários" />
      <Box p={3}>
        <iframe
          src="http://localhost:3002"
          style={{ width: '100%', height: '80vh', border: 'none', borderRadius: 12 }}
          title="Usuários"
        />
      </Box>
    </Box>
  );
}