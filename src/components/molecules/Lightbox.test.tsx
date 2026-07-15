import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const gsapFromTo = jest.fn();
const gsapTo = jest.fn(
  (_target: unknown, options: { onComplete?: () => void }) => {
    options.onComplete?.();
    return {};
  }
);

jest.mock('@/lib/animations/gsap', () => ({
  gsap: {
    fromTo: (...args: unknown[]) =>
      (gsapFromTo as unknown as (...args: unknown[]) => unknown)(...args),
    to: (...args: unknown[]) =>
      (gsapTo as unknown as (...args: unknown[]) => unknown)(...args),
  },
}));

import { Lightbox } from './Lightbox';

describe('Lightbox', () => {
  const photos = [
    { slot: 'L' as const, src: '/a.jpg', labelKey: 'trip', year: 2024 },
    { slot: 'M1' as const, src: '/b.jpg', labelKey: null, year: 2025 },
    { slot: 'M2' as const, src: '/c.jpg', labelKey: null },
  ];

  const defaultProps = {
    photos,
    initialIndex: 0,
    onClose: jest.fn(),
  };

  const setup = (props = {}) => render(<Lightbox {...defaultProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
    defaultProps.onClose = jest.fn();
  });

  it('should render the dialog as modal', () => {
    setup();

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('should render the counter with the current position and total', () => {
    setup();

    expect(screen.getByText('01 / 03')).toBeInTheDocument();
  });

  it('should render the caption when the photo has a labelKey', () => {
    setup();

    expect(screen.getByText(/trip.*2024/)).toBeInTheDocument();
  });

  it('should render just the year when the labelKey is absent', () => {
    setup({ initialIndex: 1 });

    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  it('should render no caption when both labelKey and year are missing', () => {
    setup({ initialIndex: 2 });

    expect(screen.queryByText(/^\d{4}$/)).not.toBeInTheDocument();
  });

  it('should navigate to the next photo on right arrow', () => {
    setup();

    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(screen.getByText('02 / 03')).toBeInTheDocument();
  });

  it('should wrap to the first photo when navigating past the last one', () => {
    setup({ initialIndex: 2 });

    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(screen.getByText('01 / 03')).toBeInTheDocument();
  });

  it('should navigate to the previous photo on left arrow', () => {
    setup({ initialIndex: 1 });

    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    expect(screen.getByText('01 / 03')).toBeInTheDocument();
  });

  it('should wrap to the last photo when navigating before the first one', () => {
    setup();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    expect(screen.getByText('03 / 03')).toBeInTheDocument();
  });

  it('should call onClose when Escape is pressed', () => {
    const onClose = jest.fn();
    setup({ onClose });

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when the close button is clicked', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    setup({ onClose });

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it('should navigate to the next photo when the Next button is clicked', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('button', { name: /next photo/i }));

    expect(screen.getByText('02 / 03')).toBeInTheDocument();
  });

  it('should navigate to the previous photo when the Previous button is clicked', async () => {
    const user = userEvent.setup();
    setup({ initialIndex: 1 });

    await user.click(screen.getByRole('button', { name: /previous photo/i }));

    expect(screen.getByText('01 / 03')).toBeInTheDocument();
  });

  it('should lock the body scroll while open and restore it on unmount', () => {
    document.body.style.overflow = 'auto';
    const { unmount } = setup();

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('auto');
  });

  it('should close when the backdrop is clicked', () => {
    const onClose = jest.fn();
    setup({ onClose });
    const dialog = screen.getByRole('dialog');

    fireEvent.click(dialog);

    expect(onClose).toHaveBeenCalled();
  });

  it('should ignore clicks on inner elements', () => {
    const onClose = jest.fn();
    setup({ onClose });

    fireEvent.click(screen.getByRole('img'));

    expect(onClose).not.toHaveBeenCalled();
  });
});
