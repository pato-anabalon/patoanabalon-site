import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  const defaultProps = {
    children: 'Click me',
  };

  const setup = (props = {}) => render(<Button {...defaultProps} {...props} />);

  it('should render the children as button label', () => {
    setup();

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick when the user clicks the button', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    setup({ onClick });

    await user.click(screen.getByRole('button', { name: /click me/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    setup({ onClick, disabled: true });

    await user.click(screen.getByRole('button', { name: /click me/i }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should render as disabled when disabled prop is true', () => {
    setup({ disabled: true });

    expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled();
  });

  it('should forward extra className to the underlying button', () => {
    setup({ className: 'custom-class' });

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should support the outline variant', () => {
    setup({ variant: 'outline' });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should support the ghost variant', () => {
    setup({ variant: 'ghost' });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should support the sm size', () => {
    setup({ size: 'sm' });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should support the lg size', () => {
    setup({ size: 'lg' });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should forward the type attribute', () => {
    setup({ type: 'submit' });

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
