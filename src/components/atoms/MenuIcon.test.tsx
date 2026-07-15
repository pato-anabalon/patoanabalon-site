import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MenuIcon } from './MenuIcon';

describe('MenuIcon', () => {
  const defaultProps = {
    isOpen: false,
    onClick: jest.fn(),
  };

  const setup = (props = {}) =>
    render(<MenuIcon {...defaultProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with the default Menu label when closed', () => {
    setup();

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('should render the Close label when open', () => {
    setup({ isOpen: true });

    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('should use the provided label when closed', () => {
    setup({ label: 'Menú' });

    expect(screen.getByText('Menú')).toBeInTheDocument();
  });

  it('should expose aria-expanded reflecting the isOpen state', () => {
    const { rerender } = setup();

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');

    rerender(<MenuIcon {...defaultProps} isOpen={true} />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('should announce Open menu when closed', () => {
    setup();

    expect(
      screen.getByRole('button', { name: /open menu/i })
    ).toBeInTheDocument();
  });

  it('should announce Close menu when open', () => {
    setup({ isOpen: true });

    expect(
      screen.getByRole('button', { name: /close menu/i })
    ).toBeInTheDocument();
  });

  it('should call onClick when the user clicks the button', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    setup({ onClick });

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
