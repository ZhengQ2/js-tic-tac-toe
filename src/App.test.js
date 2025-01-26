// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic-Tac-Toe game', () => {
  render(<App />);
  const element = screen.getByText(/tic-tac-toe/i);
  expect(element).toBeInTheDocument();
});
