import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios to avoid real network calls
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { status: 'running', activities: [] } })),
}));

test('renders dashboard heading', async () => {
  render(<App />);
  expect(screen.getByText(/Orchid Agent Dashboard/i)).toBeInTheDocument();
});
