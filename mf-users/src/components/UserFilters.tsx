// mf-users/src/components/UserFilters.tsx
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';

interface UserFiltersProps {
  busca: string;
  status: string;
  onBuscaChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}

export function UserFilters({ busca, status, onBuscaChange, onStatusChange }: UserFiltersProps) {
  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      <TextField
        value={busca}
        onChange={(e) => onBuscaChange(e.target.value)}
        placeholder="Buscar por nome ou e-mail..."
        size="small"
        sx={{ minWidth: 280 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
            </InputAdornment>
          ),
        }}
      />

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <MenuItem value="todos">Todos</MenuItem>
          <MenuItem value="ativo">Ativo</MenuItem>
          <MenuItem value="inativo">Inativo</MenuItem>
          <MenuItem value="pendente">Pendente</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
