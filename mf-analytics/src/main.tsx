import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Analytics from './index';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ padding: 24, background: '#F5F7FA', minHeight: '100vh' }}>
      <Analytics />
    </div>
  </StrictMode>
);