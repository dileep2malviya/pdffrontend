import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import UploadWorkbench from './components/UploadWorkbench';

test('renders PDF Orbit brand', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const brandElement = screen.getByText(/pdf orbit/i);
  expect(brandElement).toBeInTheDocument();
});

test('renders file upload controls for tools', () => {
  render(<UploadWorkbench title="Merge PDF" toolSlug="merge-pdf" />);

  expect(screen.getByRole('button', { name: /choose files/i })).toBeInTheDocument();
  expect(screen.getByText(/no files selected yet/i)).toBeInTheDocument();
});
