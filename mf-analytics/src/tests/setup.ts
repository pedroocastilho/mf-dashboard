// mf-analytics/src/tests/setup.ts
import '@testing-library/jest-dom';

// Mock do ResizeObserver — não existe no jsdom mas o Recharts precisa
(globalThis as any).ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
